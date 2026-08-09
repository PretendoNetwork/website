import { removeDiscordMemberSupporterRole, removeDiscordMemberTesterRole } from '~~/server/utils/discord';

export default defineEventHandler(async (event): Promise<void> => {
	const auth = enforceLoggedIn(event);
	const discord = useDiscord(event);
	if (!discord) {
		throw createError({
			status: 400,
			message: 'Discord integration not configured'
		});
	}

	const grpc = useApiGrpcWithToken(event, auth.token);
	const oldUserData = await grpc.getUserData({});
	const oldDiscordId = oldUserData.connections?.discord?.id;
	await grpc.setDiscordConnectionData({
		id: ''
	});

	const priceId = oldUserData.connections?.stripe?.priceId;
	const stripe = useStripe(event);
	if (stripe) {
		if (priceId && oldDiscordId) {
			const price = await stripe.prices.retrieve(priceId);
			const product = await stripe.products.retrieve(price.product as string);
			const discordRoleId = product.metadata.discord_role_id;

			if (discordRoleId) {
				await removeDiscordMemberSupporterRole(discord, oldDiscordId, discordRoleId);
			}
			if (product.metadata.beta === 'true') {
				await removeDiscordMemberTesterRole(discord, oldDiscordId);
			}
		}
	}
});
