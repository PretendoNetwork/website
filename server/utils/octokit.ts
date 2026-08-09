import { Octokit } from "octokit"
import type { H3Event } from 'h3'

let octokit: Octokit | null = null;

export function useOctokit(event: H3Event): Octokit | null {
	if (!octokit) {
		const config = useRuntimeConfig(event);
		if (config.githubApiToken) {
			octokit = new Octokit({ auth: config.githubApiToken });
		}
	}
	return octokit;
}
