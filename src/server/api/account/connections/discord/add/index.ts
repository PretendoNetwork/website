import DiscordOauth2 from 'discord-oauth2';
import { FetchError } from 'ofetch';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const cookies = parseCookies(event);

	const discordOauth = new DiscordOauth2({
		clientId: useRuntimeConfig(event).discord.clientID,
		clientSecret: useRuntimeConfig(event).discord.clientSecret,
		redirectUri: `http://localhost:3000/account/connect/discord`,
		version: 'v10'
	});

	try {
		// Attempt to get OAuth2 tokens
		const tokens = await discordOauth.tokenRequest({
			code: body.code,
			scope: 'identify guilds',
			grantType: 'authorization_code'
		});

		const discordUser = await discordOauth.getUser(tokens.access_token);

		await $fetch(`/v1/connections/add/discord`, {
			method: 'POST',
			baseURL: useRuntimeConfig(event).apiBase,
			headers: { Authorization: `${cookies?.token_type} ${cookies?.access_token}` },
			body: {
				data: {
					id: discordUser.id
				}
			}
		});

		return { success: true }; // TODO: figure out why $fetch doesn't send cookies but useFetch does so this dumb fix can be removed
	} catch (error: unknown) {
		console.log(error);
		if (error instanceof FetchError) {
			setResponseStatus(event, error.status, error.data.error);
		} else {
			setResponseStatus(event, 500);
		}

		event.node.res.end();

		return;
	}
});
