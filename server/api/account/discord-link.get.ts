import { useDiscord } from "~~/server/utils/discord";
import { ApiAccountDiscordLink } from "~~/shared/api-types";

export default defineEventHandler(async (event): Promise<ApiAccountDiscordLink> => {
	enforceLoggedIn(event);
	const discord = useDiscord(event);
	if (!discord) throw createError({
		status: 400,
		message: 'Discord integration not configured',
	})

	const redirectUrl = discord.makeCallbackUrl();
	const url = new URL("https://discord.com/oauth2/authorize");
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('client_id', 'code');
	url.searchParams.set('scope', 'identify');
	url.searchParams.set('redirect_uri', redirectUrl);
	url.searchParams.set('prompt', 'scope');
	url.searchParams.set('integration_type', '1');
	return {
		url: url.toString(),
	}
});
