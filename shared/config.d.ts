declare module 'nuxt/schema' {
	interface RuntimeConfig {
		trustProxy: boolean;

		githubApiToken: string;

		stripeSecretKey: string;
		stripeWebhookSecret: string;
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

		apiBase: string;
		apiBaseHost: string;

		redisUrl: string;
	}

	interface PublicRuntimeConfig {
		baseUrl: string;
		cdnBaseUrl: string;
		redirectHosts: string;
		cookieSecure: boolean;
		hcaptchaSiteKey: string;
	}
}

export { };
