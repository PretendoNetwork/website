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

export type ApiAccountDiscordLink = {
	url: string
};

export const LoginSchema = z.object({
	username: z.string(),
	password: z.string()
});
export type ApiAuthLoginRequest = z.infer<typeof LoginSchema>;

export const AccountUpdateSchema = z.object({
	mii: z.object({
		name: z.string(),
		primary: z.enum(['Y', 'N']),
		data: z.string()
	}).optional(),
	environment: z.enum(['prod', 'test', 'dev']).optional()
});
export type ApiAccountUpdateRequest = z.infer<typeof AccountUpdateSchema>;

export const ResetPasswordSchema = z.object({
	password: z.string(),
	passwordConfirm: z.string(),
	resetToken: z.string(),
});
export type ApiAuthResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;

export const ForgotPasswordSchema = z.object({
	emailOrPassword: z.string(),
});
export type ApiAuthForgotPasswordRequest = z.infer<typeof ForgotPasswordSchema>;

export const CheckoutSchema = z.object({
	priceId: z.string(),
});
export type ApiAccountCheckoutRequest = z.infer<typeof CheckoutSchema>;
