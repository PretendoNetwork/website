import { ClientError } from 'nice-grpc';
import { LoginSchema } from '#shared/api-types';
import type { ApiErrorCodes } from '~~/shared/errors';
import type { ApiAuthLogin } from '#shared/api-types';

const bucket = createRatelimitBucket({
	id: 'login',
	points: 30,
	durationSec: 5 * 60, // 5 minutes
	blockDurationSec: 1 * 60 * 60 // 1 hour
});

const errors: Record<string, ApiErrorCodes> = {
	'INVALID_ARGUMENT: User not found': 'INVALID_USERNAME',
	'INVALID_ARGUMENT: Password is incorrect': 'INVALID_PASSWORD',
	'UNAUTHENTICATED: Account has been deleted': 'ACCOUNT_DELETED'
};

export default defineEventHandler(async (event): Promise<ApiAuthLogin> => {
	await enforceRatelimit(event, bucket);
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
			const errorCode = errors[error.details];
			if (errorCode) {
				throw createApiError(errorCode);
			}
		}
		throw error;
	}
});
