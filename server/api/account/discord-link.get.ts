import { useDiscord } from '~~/server/utils/discord';
import type { ApiAccountDiscordLink } from '~~/shared/api-types';

export default defineEventHandler(async (event): Promise<ApiAccountDiscordLink> => {
	enforceLoggedIn(event);
	const discord = useDiscord(event);
	if (!discord) {
		throw createApiError('INTEGRATION_DISABLED');
	}

	const redirectUrl = discord.makeCallbackUrl();
	const url = new URL('https://discord.com/oauth2/authorize');
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('client_id', discord.clientId);
	url.searchParams.set('scope', 'identify');
	url.searchParams.set('redirect_uri', redirectUrl);
	url.searchParams.set('prompt', 'scope');
	url.searchParams.set('integration_type', '1');
	return {
		url: url.toString()
	};
});
