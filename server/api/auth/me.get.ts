import type { GetApiAuthMe } from '#shared/api-types';

export default defineEventHandler(async (event): Promise<GetApiAuthMe> => {
	const config = useRuntimeConfig(event);
	const auth = enforceLoggedIn(event);

	const apiGrpc = useApiGrpcWithToken(event, auth.token);
	const data = await apiGrpc.getUserData({ });
	return {
		pid: data.pid,
		username: data.username,
		accessLevel: data.accessLevel,
		birthday: data.birthday,
		gender: data.gender,
		country: data.country,
		timezone: data.timezone,
		emailAddress: data.emailAddress,
		serverAccessLevel: data.serverAccessLevel as any,
		discordId: data.connections?.discord?.id ?? null,
		stripeTier: data.connections?.stripe?.subscriptionId
			? {
					subscriptionId: data.connections.stripe.subscriptionId,
					priceId: data.connections.stripe.priceId ?? '',
					tierName: data.connections.stripe.tierName ?? '',
					tierLevel: data.connections.stripe.tierLevel ?? ''
				}
			: null,
		mii: data.mii
			? {
					imageUrl: `${config.public.cdnBaseUrl}/mii/${data.pid}/normal_face.png`,
					name: data.mii.name,
					data: data.mii.data
				}
			: null
	};
});
