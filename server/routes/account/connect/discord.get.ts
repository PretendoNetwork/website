import { assignDiscordMemberSupporterRole, assignDiscordMemberTesterRole } from '~~/server/utils/discord';

type DiscordTokenResponse = {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
};

type DiscordUserResponse = {
	user?: {
		id: string;
	};
};

// Discord oauth callback
export default defineEventHandler(async (event) => {
	const discord = useDiscord(event);
	if (!discord) {
		return sendRedirect(event, '/');
	}

	const discordFetch = $fetch.create({
		baseURL: discord.baseUrl
	});
	const accessTokenCookie = getCookie(event, 'access_token');
	const query = getQuery(event);

	const authCode = query.code?.toString();
	if (!authCode || !accessTokenCookie) {
		return sendRedirect(event, '/');
	}

	const tokens = await discordFetch<DiscordTokenResponse>('/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: discord.clientId,
			client_secret: discord.clientSecret,
			code: authCode,
			redirect_uri: discord.makeCallbackUrl()
		})
	});
	const authInfo = await discordFetch<DiscordUserResponse>('/oauth2/@me', {
		headers: {
			Authorization: `Bearer ${tokens.access_token}`
		}
	});
	if (!authInfo.user) {
		return sendRedirect(event, '/'); // No identify scope
	}

	const discordId = authInfo.user.id;
	const grpc = useApiGrpcWithToken(event, accessTokenCookie ?? '');
	await grpc.setDiscordConnectionData({
		id: discordId
	});

	const userData = await grpc.getUserData({});
	const priceId = userData.connections?.stripe?.priceId;
	const stripe = useStripe(event);
	if (stripe && priceId) {
		if (priceId) {
			const price = await stripe.prices.retrieve(priceId);
			const product = await stripe.products.retrieve(price.product as string);
			const discordRoleId = product.metadata.discord_role_id;

			if (discordRoleId) {
				await assignDiscordMemberSupporterRole(discord, discordId, discordRoleId);
			}
			if (product.metadata.beta === 'true') {
				await assignDiscordMemberTesterRole(discord, discordId);
			}
		}
	}

	return sendRedirect(event, '/account');
});
