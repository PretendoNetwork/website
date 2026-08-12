import { getGithubProjects } from '../utils/getGithubProgress';
import { getStripeDonations } from '../utils/getStripeDonations';
import type { GetProgress, ProgressItem } from '#shared/api-types';

const donationGoalCents = 3000 * 100;

export default defineEventHandler(async (event): Promise<GetProgress> => {
	const octokit = useOctokit(event);
	const stripe = useStripe(event);
	const donationData = await getStripeDonations(stripe);
	const { projects } = await getGithubProjects(octokit);

	const items: ProgressItem[] = projects.map((v) => {
		const totalTasks = v.tasks.length;
		const completedTasks = v.tasks.filter(v => v.status === 'completed').length;
		const halfCompletedTasks = v.tasks.filter(v => v.status === 'inprogress').length;
		const percentage = Math.floor((completedTasks + (halfCompletedTasks * 0.5)) / totalTasks * 100);

		return {
			title: v.title,
			githubUrl: v.url,
			completion: percentage,
			tasks: v.tasks.map(task => ({
				status: task.status,
				title: task.title
			}))
		};
	});
	const summedCompletion = items.reduce((a, v) => a + v.completion, 0);
	const completionPercentage = Math.floor(summedCompletion / items.length);

	return {
		completion: completionPercentage,
		donations: {
			currentCents: donationData.totalDonationsCents,
			goalCents: donationGoalCents
		},
		items
	};
});
