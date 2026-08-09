import type { Octokit } from 'octokit';

export type GithubProjectTaskStatus = 'completed' | 'inprogress' | 'notstarted';

export type GithubProject = {
	title: string;
	url: string;
	tasks: Array<{
		title: string;
		status: GithubProjectTaskStatus;
	}>;
};

export type GithubProjectResponse = {
	projects: GithubProject[];
};

const orgName = 'PretendoNetwork';
const cacheMaxAgeMs = 60 * 60 * 1000; // 1 hour
let cache: { response: GithubProjectResponse; createdAt: Date } | null = null;

const getProjectsV2GQL = `
query getProjectsV2($orgName: String!, $cursor: String) {
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

const getProjectsV2FieldsGQL = `
query getProjectsV2Fields($id: ID!, $cursor: String) {
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

async function getGitHubProjectsV2(octokit: Octokit) {
	const projects: Array<{ id: string; title: string; url: string | null }> = [];

	const data = await octokit.graphql.paginate(getProjectsV2GQL, {
		orgName: orgName
	});

	for (const node of data.organization.projectsV2.nodes) {
		projects.push({
			id: node.id,
			title: node.title,
			url: node.repositories.nodes[0]?.url ?? null
		});
	}

	return projects;
}

async function getGitHubProjectsV2Fields(octokit: Octokit, id: string) {
	const output: Array<{ title: string; column: string }> = [];

	const data: any = await octokit.graphql.paginate(getProjectsV2FieldsGQL, {
		id: id
	});

	for (const node of data.node.items.nodes) {
		output.push({
			title: node.content.title,
			column: node.fieldValues.nodes.find((fieldValue: any) => fieldValue.field?.name === 'Status')?.name
		});
	}

	return output;
}

async function getGithubProjectsData(octokit: Octokit): Promise<GithubProjectResponse> {
	const projects = await getGitHubProjectsV2(octokit);
	const output: GithubProject[] = [];

	for (const project of projects) {
		if (!project.url) {
			continue;
		}

		const projectOutput: GithubProject = {
			title: project.title,
			url: project.url,
			tasks: []
		};

		const fields = await getGitHubProjectsV2Fields(octokit, project.id);

		const fieldMap: Record<string, GithubProjectTaskStatus> = {
			done: 'completed',
			in_progress: 'inprogress',
			todo: 'notstarted'
		};

		for (const field of fields) {
			const normalizedStatus = field.column.toLowerCase().replace(' ', '_');
			const status = fieldMap[normalizedStatus];
			if (!status) {
				continue;
			}
			projectOutput.tasks.push({
				status,
				title: field.title
			});
		}

		output.push(projectOutput);
	}

	return {
		projects: output
	};
}

export async function getGithubProjects(octokit: Octokit | null, ignoreCache = false): Promise<GithubProjectResponse> {
	if (!cache || new Date(cache.createdAt.getTime() + cacheMaxAgeMs) < new Date() || ignoreCache) {
		// No github credentials, assume there are no projects
		if (!octokit) {
			return {
				projects: []
			};
		}

		cache = {
			createdAt: new Date(),
			response: await getGithubProjectsData(octokit)
		};
	}
	return cache.response;
}
