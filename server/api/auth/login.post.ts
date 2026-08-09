import { ServerError } from "nice-grpc";
import { ApiAuthLogin, LoginSchema } from "#shared/api-types"

export default defineEventHandler(async (event): Promise<ApiAuthLogin> => {
	const body = await readZodBody(event, LoginSchema);
	const grpc = useApiGrpc(event);

	try {
		const res = await grpc.login({
			username: body.username,
			password: body.password,
			grantType: 'password'
		});

		return {
			accessToken: res.accessToken,
			refreshToken: res.refreshToken
		};
	} catch (error: unknown) {
		if (error instanceof ServerError) {
			if (error.details === 'INVALID_ARGUMENT: User not found') {
				throw createError({
					status: 400,
					message: 'User not found'
				});
			}
			if (error.details === 'INVALID_ARGUMENT: Password is incorrect') {
				throw createError({
					status: 400,
					message: 'Password was incorrect'
				});
			}
		}
		throw error;
	}
});
