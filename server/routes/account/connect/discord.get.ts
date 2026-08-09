type DiscordTokenResponse = {
	"access_token": string,
	"token_type": string,
	"expires_in": number,
	"refresh_token": string,
	"scope": string
}

type DiscordUserResponse = {
	"user"?: {
		id: string,
	}
}

// Discord oauth callback
export default defineEventHandler(async (event) => {
	const discord = useDiscord(event);
	const discordFetch = $fetch.create({
		baseURL: discord.baseUrl,
	});
	const accessTokenCookie = getCookie(event, 'access_token');
	const query = getQuery(event);

	const authCode = query.code?.toString();
	if (!authCode || !accessTokenCookie) {
		return sendRedirect(event, '/');
	}

	const tokens = await discordFetch<DiscordTokenResponse>('/oauth2/token', {
		body: new URLSearchParams({
			'grant_type': 'authorization_code',
			'code': authCode,
			'redirect_uri': discord.makeCallbackUrl(),
		})
	});
	const authInfo = await discordFetch<DiscordUserResponse>('/oauth2/@me', {
		headers: {
			'Authorization': `Bearer ${tokens.access_token}`
		}
	});
	if (!authInfo.user) {
		return sendRedirect(event, '/'); // No identify scope
	}

	const grpc = useApiGrpcWithToken(event, accessTokenCookie ?? '');
	await grpc.setDiscordConnectionData({
		id: authInfo.user.id
	});

	// TODO set roles based on stripe info

	return sendRedirect(event, '/account');
});
