const jsonConfig = require('../config.json');

const disableEmail = !jsonConfig.email?.from?.trim() || !jsonConfig.email?.ses?.region?.trim() || !jsonConfig.email?.ses?.key?.trim() || !jsonConfig.email?.ses?.secret?.trim();

const email = disableEmail
	? false
	: {
			from: jsonConfig.email.from,
			ses: {
				region: jsonConfig.email.ses.region,
				key: jsonConfig.email.ses.key,
				secret: jsonConfig.email.ses.secret
			}
		};

module.exports = {
	api_base: jsonConfig.api_base,
	http: {
		base_url: jsonConfig.http.base_url,
		port: jsonConfig.http.port
	},
	github: {
		graphql_token: jsonConfig.github.graphql_token
	},
	stripe: {
		secret_key: jsonConfig.stripe.secret_key,
		webhook_secret: jsonConfig.stripe.webhook_secret,
		goal_cents: jsonConfig.stripe.goal_cents,
		notification_emails: jsonConfig.stripe.notification_emails
	},
	database: {
		account: {
			connection_string: jsonConfig.database.account.connection_string,
			options: jsonConfig.database.account.options
		}
	},
	discord: {
		bot_token: jsonConfig.discord.bot_token,
		client_id: jsonConfig.discord.client_id,
		client_secret: jsonConfig.discord.client_secret,
		guild_id: jsonConfig.discord.guild_id,
		roles: {
			supporter: jsonConfig.discord.roles.supporter,
			tester: jsonConfig.discord.roles.tester
		}
	},
	discourse: {
		sso: {
			secret: jsonConfig.discourse.sso.secret
		}
	},
	email
};
