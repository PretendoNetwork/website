import type { GetApiAuthMe } from '#shared/api-types';

export default defineEventHandler(async (event): Promise<GetApiAuthMe> => {
	const auth = enforceLoggedIn(event);

	const grpc = useAccountGrpc(event);
	const data = await grpc.getUserData({ pid: auth.pid });
	return {
		pid: data.pid,
		username: data.username,
		accessLevel: data.accessLevel,
		serverAccessLevel: data.serverAccessLevel as any,
		mii: data.mii
			? {
					imageUrl: `https://r2-cdn.pretendo.cc/mii/${data.pid}/normal_face.png`,
					name: data.mii.name
				}
			: null
	};
});
