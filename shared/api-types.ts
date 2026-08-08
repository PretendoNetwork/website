import { z } from 'zod';

export type GetApiAuthMe = {
	pid: number;
	username: string;
	mii: {
		imageUrl: string;
		name: string;
	} | null;
}

export type ProgressItem = {
	title: string,
	githubUrl?: string,
	completion: number,
	tasks: Array<{
		status: 'completed' | 'inprogress' | 'notstarted',
		title: string,
	}>
}

export type GetProgress = {
	donations: {
		currentCents: number,
		goalCents: number,
	},
	completion: number;
	items: ProgressItem[];
}

export type ApiAuthLogin = {
	accessToken: string;
	refreshToken: string;
};

export const LoginSchema = z.object({
	username: z.string(),
	password: z.string()
});
export type ApiAuthLoginRequest = z.infer<typeof LoginSchema>;
