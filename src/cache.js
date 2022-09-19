const { GraphQLClient, gql } = require('graphql-request');
const Stripe = require('stripe');
const config = require('../config.json');

const graphql = new GraphQLClient('https://api.github.com/graphql', {
	headers: {
		Authorization: `bearer ${config.github.graphql_token}`,
	}
});
const stripe = new Stripe(config.stripe.secret_key);

const getProjectCards = gql`
    fragment ItemContent on Node {
        __typename
        ... on DraftIssue {
            title
        }
        ... on Issue {
            title
        }
    }

    fragment Itemfields on Node {
        __typename
        ... on ProjectV2ItemFieldSingleSelectValue {
            name,
            field {
                ... on ProjectV2SingleSelectField {
                    name
                }
            }
        }
    }

    query getProjectCards($orgName: String!) {
        organization(login: $orgName) {
            projectsV2(first: 100) {
                nodes {
                    repositories(first: 1) {
                        nodes {
                            url
                        }
                    }
                    title
                    items(first: 100) {
                        nodes {
                            id
                            content {
                                ...ItemContent
                            }
                            fieldValues(first: 20) {
                                nodes {
                                    ...Itemfields
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

let githubProjectsCache;
let stripeDonationCache;

async function getGithubProjectsCache() {
	if (!githubProjectsCache) {
		githubProjectsCache = await updateGithubProjectsCache();
	}

	if (githubProjectsCache.update_time < Date.now() - (1000 * 60 * 60)) {
		githubProjectsCache = await updateGithubProjectsCache();
	}

	return githubProjectsCache;
}

function getProgressField(fields) {
	const found = fields.nodes.find(v => v.field?.name === 'Status');
	return found?.name ?? undefined;
}

async function updateGithubProjectsCache() {
	const projectsCacheData = {
		update_time: Date.now(),
		sections: []
	};

	const data = await graphql.request(getProjectCards, {
		orgName: 'PretendoNetwork',
	});

	const projects = data.organization.projectsV2.nodes;

	for (const project of projects) {
		if (!project.repositories.nodes[0]) {
			continue;
		}

		const extractedData = {
			title: project.title,
			url: project.repositories.nodes[0]?.url,
			cards: {
				done: [],
				in_progress: [],
				todo: []
			}
		};

		for (const { content, fieldValues } of project.items.nodes) {
			const progress = getProgressField(fieldValues);

			if (!['DraftIssue'].includes(content.__typename)) {
				continue; // not a supported card, skip
			}

			if (!progress) {
				continue; // entry does not have a status, skip
			}

			extractedData.cards[progress.toLowerCase().replace(' ', '_')]?.push(content.title);
		}

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
