import { ClientError } from 'nice-grpc';
import { RefreshSchema } from '#shared/api-types';
import type { ApiAuthLogin } from '#shared/api-types';

export default defineEventHandler(async (event): Promise<ApiAuthLogin> => {
	const body = await readZodBody(event, RefreshSchema);
	const grpc = useApiGrpc(event);

	try {
		const res = await grpc.login({
			refreshToken: body.token,
			grantType: 'refresh_token'
		});

		return {
			accessToken: res.accessToken,
			refreshToken: res.refreshToken
		};
	} catch (error: unknown) {
		if (error instanceof ClientError) {
			if (error.details === 'INVALID_ARGUMENT: Invalid or missing refresh token') {
				throw createApiError('UNAUTHENTICATED');
			}
		}
		throw error;
	}
});
