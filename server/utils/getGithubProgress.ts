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

const getProjectsWithItemsV2GQL = `
query getProjectsV2($orgName: String!, $cursor: String) {
	organization(login: $orgName) {
		projectsV2(first: 50, after: $cursor) {
			nodes {
				id
				title
				repositories(first: 1) {
					nodes {
						url
					}
				}
				items(first: 100) {
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

async function getGitHubProjectsWithItemsV2(octokit: Octokit) {
	const projects: Array<{ id: string; title: string; url: string | null; items: Array<{ title: string; column: string }> }> = [];

	const data = await octokit.graphql.paginate(getProjectsWithItemsV2GQL, {
		orgName: orgName
	});

	for (const node of data.organization.projectsV2.nodes) {
		projects.push({
			id: node.id,
			title: node.title,
			url: node.repositories.nodes[0]?.url ?? null,
			items: node.items.nodes.map((item: any) => ({
				title: item.content.title,
				column: item.fieldValues.nodes.find((fieldValue: any) => fieldValue.field?.name === 'Status')?.name
			}))
		});
	}

	return projects;
}

async function getGithubProjectsData(octokit: Octokit): Promise<GithubProjectResponse> {
	const projects = await getGitHubProjectsWithItemsV2(octokit);
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

		const fieldMap: Record<string, GithubProjectTaskStatus> = {
			done: 'completed',
			in_progress: 'inprogress',
			todo: 'notstarted'
		};

		for (const field of project.items) {
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

const cacheKey = 'githubProjects';
const cacheMaxAgeMs = 60 * 60 * 1000; // 1 hour

export async function getGithubProjects(cacher: Cacher, octokit: Octokit | null, ignoreCache = false): Promise<GithubProjectResponse> {
	if (!octokit) {
		return {
			projects: []
		};
	}

	if (!ignoreCache) {
		const cached = await cacher.get<GithubProjectResponse>(cacheKey);
		if (cached) {
			return cached;
		}
	}

	const data = await getGithubProjectsData(octokit);
	await cacher.set(cacheKey, data, cacheMaxAgeMs);
	return data;
}
