import { z } from 'zod';

export type GetApiAuthMe = {
	pid: number;
	username: string;
	accessLevel: number;
	birthday: string;
	gender: string;
	country: string;
	region: number;
	timezone: string;
	emailAddress: string;
	emailValidated: boolean;
	serverAccessLevel: 'dev' | 'test' | 'prod';
	discordId: string | null;
	stripeTier: {
		subscriptionId: string;
		priceId: string;
		tierName: string;
		tierLevel: string | number;
	} | null;
	mii: {
		imageUrl: string;
		name: string;
		data: string;
	} | null;
};

export type GetApiAuthMeConections = {
	pid: number;
	discord: {
		id: string;
		username: string;
		discriminator: string;
		avatar: string | null;
		avatarUrl: string | null;
	} | null;
};

export type ProgressItem = {
	title: string;
	githubUrl?: string;
	completion: number;
	tasks: Array<{
		status: 'completed' | 'inprogress' | 'notstarted';
		title: string;
	}>;
};

export type GetProgress = {
	donations: {
		currentCents: number;
		goalCents: number;
	};
	completion: number;
	items: ProgressItem[];
};

export type ApiAuthLogin = {
	accessToken: string;
	refreshToken: string;
};

export type ApiAccountDiscordLink = {
	url: string;
};

export type ApiAccountCheckoutLink = {
	url: string;
};

export type TierItem = {
	priceId: string;
	tierLevel: number;
	priceCents: number;
	thumbnailUrl: string | null;
	name: string;
	description: string | null;
	perks: {
		discordRead: boolean;
		beta: boolean;
	};
};

export type ApiAccountTiers = {
	tiers: TierItem[];
};

export const LoginSchema = z.object({
	username: z.string(),
	password: z.string()
});
export type ApiAuthLoginRequest = z.infer<typeof LoginSchema>;

export const RefreshSchema = z.object({
	token: z.string()
});
export type ApiAuthRefreshRequest = z.infer<typeof RefreshSchema>;

export const RegisterSchema = z.object({
	email: z.string(),
	username: z.string(),
	miiName: z.string(),
	password: z.string(),
	passwordConfirm: z.string(),
	birthday: z.iso.date(),
	captchaResponse: z.string().optional()
});
export type ApiAuthRegisterRequest = z.infer<typeof RegisterSchema>;

export const AccountUpdateSchema = z.object({
	birthday: z.string().optional(),
	mii: z.string().optional(),
	serverAccessLevel: z.enum(['prod', 'test', 'dev']).optional(),
	gender: z.enum(['F', 'M']).optional(),
	region: z.number().optional(),
	timezone: z.string().optional()
});
export type ApiAccountUpdateRequest = z.infer<typeof AccountUpdateSchema>;

export const EmailUpdateSchema = z.object({
	email: z.string()
});
export type ApiAccountEmailUpdateRequest = z.infer<typeof EmailUpdateSchema>;

export const PasswordUpdateSchema = z.object({
	oldPassword: z.string(),
	newPassword: z.string(),
	newPasswordConfirm: z.string()
});
export type ApiAccountPasswordUpdateRequest = z.infer<typeof PasswordUpdateSchema>;

export const EmailVerifySchema = z.object({
	token: z.string()
});
export type ApiAccountEmailVerifyRequest = z.infer<typeof EmailVerifySchema>;

export const ResetPasswordSchema = z.object({
	password: z.string(),
	passwordConfirm: z.string(),
	resetToken: z.string()
});
export type ApiAuthResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;

export const ForgotPasswordSchema = z.object({
	emailOrPassword: z.string(),
	captchaResponse: z.string().optional()
});
export type ApiAuthForgotPasswordRequest = z.infer<typeof ForgotPasswordSchema>;

export const CheckoutSchema = z.object({
	priceId: z.string()
});
export type ApiAccountCheckoutRequest = z.infer<typeof CheckoutSchema>;
