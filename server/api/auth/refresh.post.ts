import { ClientError } from 'nice-grpc';
import { RefreshSchema } from '#shared/api-types';
import type { ApiAuthLogin } from '#shared/api-types';

const bucket = createRatelimitBucket({
	id: 'refresh',
	points: 10,
	durationSec: 1 * 60, // 1 minute
	blockDurationSec: 1 * 60 * 60 // 1 hour
});

export default defineEventHandler(async (event): Promise<ApiAuthLogin> => {
	await enforceRatelimit(event, bucket);
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
