import { z } from 'zod';

export interface GetApiAuthMe {
	pid: number;
	username: string;
	mii: {
		imageUrl: string;
		name: string;
	} | null;
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
