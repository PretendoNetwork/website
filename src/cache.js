const { GraphQLClient, gql } = require('graphql-request');
const Stripe = require('stripe');
const logger = require('./logger');
const config = require('../config.json');

const github = new GraphQLClient('https://api.github.com/graphql', {
	headers: {
		Authorization: `bearer ${config.github.graphql_token}`,
	}
});

const stripe = new Stripe(config.stripe.secret_key);

const getProjectsV2GQL = gql`
query getProjectsV2($orgName: String!, $cursor: String!) {
	organization(login: $orgName) {
		projectsV2(first: 10, after: $cursor) {
			nodes {
				id
				title
				repositories(first: 1) {
					nodes {
						url
					}
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
}
`;

const getProjectsV2FieldsGQL = gql`
query getProjectsV2Fields($id: ID!, $cursor: String!) {
    node(id: $id) {
		... on ProjectV2 {
			items(first: 10, after: $cursor) {
				nodes {
					content {
						... on DraftIssue {
							title
						}
						... on Issue {
							title
						}
					}
					fieldValues(first: 20) {
						nodes {
							... on ProjectV2ItemFieldSingleSelectValue {
								name
								field {
									... on ProjectV2SingleSelectField {
										name
									}
								}
							}
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	}
}
`;
const GetRepositoryDescription = gql`
query GetRepositoryDescription($orgName: String!, $repoName: String!){
    repository(owner: $orgName, name: $repoName) {
		description
        main: object(expression: "main:README.md") {
            ... on Blob {
                text
            }
        }
        master: object(expression: "master:README.md") {
            ... on Blob {
                text
            }
        }        
    }
}
`; //Loophole to get the ReadMe No Matter the branch name

const serviceApps = ["account","nex","friends","wii u chat", "juxt", "website"]

let githubProjectsCache = {
	update_time: 0,
	sections: []
};

let githubCacheBeingFetched = false;

let stripeDonationCache = {
	update_time: 0,
	sections: []
};

async function getGitHubProjectsV2(after='') {
	let projects = [];

	const data = await github.request(getProjectsV2GQL, {
		orgName: 'PretendoNetwork',
		cursor: after
	});

	for (const node of data.organization.projectsV2.nodes) {
		projects.push({
			id: node.id,
			title: node.title,
			url: node.repositories.nodes[0]?.url,
		});
	}

	const { hasNextPage, endCursor } = data.organization.projectsV2.pageInfo;

	if (hasNextPage) {
		const nextPage = await getGitHubProjectsV2(endCursor);
		projects = [...projects, ...nextPage];
	}

	return projects;
}

async function getGitHubProjectsV2Fields(id, after='') {
	let fields = [];

	const data = await github.request(getProjectsV2FieldsGQL, {
		id: id,
		cursor: after
	});

	for (const node of data.node.items.nodes) {
		fields.push({
			title: node.content.title,
			column: node.fieldValues.nodes.find(fieldValue => fieldValue.field?.name === 'Status')?.name
		});
	}

	const { hasNextPage, endCursor } = data.node.items.pageInfo;

	if (hasNextPage) {
		const nextPage = await getGitHubProjectsV2Fields(id, endCursor);
		fields = [...fields, ...nextPage];
	}

	return fields;
}

async function getRepoType(name, title){
	const data = await github.request(GetRepositoryDescription, {
		orgName: 'PretendoNetwork',
		repoName: name
	 })
	 let readMe = ""
	 if (data.repository.main != null)
	 	readMe = data.repository.main.text
	 else
	 	readMe = data.repository.master.text 

	 readMe = readMe.split('\n')[0].toLowerCase()
	 let description = data.repository.description
	 if (description != null)
	 	description = description.toLowerCase()
	 else
	 	description = ""
	return await setRepoType(title.toLowerCase(),description,readMe)
}


async function setRepoType(title, description, readMe){
	let types = []
	let isGame = true
	for (let app of serviceApps)
		if (title.includes(app)){
			types.push("Service")
			isGame = false
			break
		}

	if (isGame) {
		types.push("Game")
	}
	
	if (title.includes('(') && isGame){
		if (title.includes('3ds'))
			types.push("3DS")
		else
			types.push("Wii U")
		return types
	}

	
	if (title === 'nex' || title.includes('juxt') || title.includes('account')){
		types.push('3DS')
		types.push('Wii U')
		if (title.includes('juxt'))
			types.push("Website")
	}
	else if (title.includes('web')){
		types.push("Website")
	}
	else if (description.includes('3ds') || readMe.includes('3ds') || title.includes('3ds')){
		types.push('3DS')
	}
	else{
		types.push('Wii U')
	}
	
	return types
}

async function getGithubProjectsCache() {
	if (githubCacheBeingFetched) {
		return githubProjectsCache;
	}

	try {
		if (!githubCacheBeingFetched && githubProjectsCache.update_time < Date.now() - (1000 * 60 * 60)) {
			githubCacheBeingFetched = true;
			githubProjectsCache = await updateGithubProjectsCache();
		}
	} catch (error) {
		logger.error(error);
	} finally {
		githubCacheBeingFetched = false;
	}

	return githubProjectsCache;
}

async function updateGithubProjectsCache() {
	const projectsCacheData = {
		update_time: Date.now(),
		sections: []
	};

	const projects = await getGitHubProjectsV2();

	for (const project of projects) {
		if (!project.url) {
			continue;
		}

		const extractedData = {
			title: project.title,
			url: project.url,
			cards: {
				done: [],
				in_progress: [],
				todo: []
			},
			type: []
		};

		const fields = await getGitHubProjectsV2Fields(project.id);

		for (const field of fields) {
			extractedData.cards[field.column.toLowerCase().replace(' ', '_')]?.push(field.title);
		}

		const types = await getRepoType(project.url.split("/")[4], project.title)
		extractedData.type = types

		projectsCacheData.sections.push(extractedData);
	}

	return projectsCacheData;
}

async function getStripeDonationCache() {
	if (!stripeDonationCache) {
		stripeDonationCache = await updateStripeDonationCache();
	}

	if (stripeDonationCache.update_time < Date.now() - (1000 * 60 * 60)) {
		stripeDonationCache = await updateStripeDonationCache();
	}

	return stripeDonationCache;
}

async function updateStripeDonationCache() {
	const donationCache = {
		update_time: Date.now(),
		goal: config.stripe.goal_cents,
		total: 0,
		donators: 0,
		completed_real: 0,
		completed_capped: 0
	};

	let hasMore = true;
	let lastId;

	while (hasMore) {
		const { data: activeSubscriptions, has_more } = await stripe.subscriptions.list({
			limit: 100,
			status: 'active',
			starting_after: lastId
		});

		donationCache.donators += activeSubscriptions.length;

		for (const subscription of activeSubscriptions) {
			donationCache.total += subscription.plan.amount;
			lastId = subscription.id;
		}

		hasMore = has_more;
	}

	donationCache.goal_dollars = donationCache.goal / 100;
	donationCache.total_dollars = donationCache.total / 100;

	donationCache.completed_real = Math.floor((donationCache.total / donationCache.goal) * 100); // real completion amount
	donationCache.completed_capped = Math.max(0, Math.min(donationCache.completed_real, 100)); // capped at 100

	return donationCache;
}

module.exports = {
	getGithubProjectsCache,
	getStripeDonationCache
};
