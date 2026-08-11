import { ClientError } from 'nice-grpc';
import { LoginSchema } from '#shared/api-types';
import type { ApiAuthLogin } from '#shared/api-types';

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
		if (error instanceof ClientError) {
			if (error.details === 'INVALID_ARGUMENT: User not found') {
				throw createApiError('INVALID_USERNAME');
			}
			if (error.details === 'INVALID_ARGUMENT: Password is incorrect') {
				throw createApiError('INVALID_PASSWORD');
			}
		}
		throw error;
	}
});
