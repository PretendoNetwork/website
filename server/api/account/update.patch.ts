import { AccountUpdateSchema } from '~~/shared/api-types';

export default defineEventHandler(async (event): Promise<void> => {
	const body = await readZodBody(event, AccountUpdateSchema);
	const auth = enforceLoggedIn(event);
	const grpc = useApiGrpcWithToken(event, auth.token);

	await grpc.updateUserData({
		gender: body.gender,
		birthday: body.birthday,
		region: body.region,
		timezone: body.timezone,
		mii: body.mii,
		serverAccessLevel: body.serverAccessLevel
	});
});
