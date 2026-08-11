declare module '#app' {
	interface PageMeta {
		needsAuth?: boolean;
	}
}

declare module 'nuxt/schema' {
	interface RuntimeConfig {
		githubApiToken: string;

		stripeSecretKey: string;
		stripeNotificationEmail: string;

		hcaptchaSecretKey: string;

		grpcHost: string;
		grpcApiKey: string;

		mongoConnectionString: string;

		smtpHost: string;
		smtpPort: number;
		smtpUser: string;
		smtpPassword: string;
		smtpSecure: true;
		smtpFromEmail: string;
		smtpFromName: string;

		discordBotToken: string;
		discordClientId: string;
		discordClientSecret: string;
		discordGuildId: string;
		discordTesterRoleId: string;
		discordSupporterRoleId: string;

		discourseSsoSecret: string;
	}

	interface PublicRuntimeConfig {
		baseUrl: string;
		apiBase: string;
		cookieSecure: boolean;

		hcaptchaSiteKey: string;
	}
}

export { };
