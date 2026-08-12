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
		serverAccessLevel: data.serverAccessLevel as any,
		discordId: data.connections?.discord?.id ?? null,
		mii: data.mii
			? {
					imageUrl: `${config.public.cdnBaseUrl}/mii/${data.pid}/normal_face.png`,
					name: data.mii.name
				}
			: null
	};
});
