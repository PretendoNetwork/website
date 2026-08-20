import { ClientError } from 'nice-grpc';
import { AccountUpdateSchema } from '~~/shared/api-types';
import type { ApiErrorCodes } from '~~/shared/errors';

const bucket = createRatelimitBucket({
	id: 'account-update',
	points: 100,
	durationSec: 5 * 60, // 5 minutes
	blockDurationSec: 1 * 60 * 60 // 1 hour
});

const errors: Record<string, ApiErrorCodes> = {
	'INVALID_ARGUMENT: Must be one of: prod, test, dev': 'INVALID_ACCESS_LEVEL',
	'PERMISSION_DENIED: Banned': 'BANNED',
	'INVALID_ARGUMENT: Do not have permission to enter this environment': 'INSUFFICIENT_ACCESS_LEVEL',
	'INVALID_ARGUMENT: Must be a valid date formatted as: YYYY-MM-DD': 'INVALID_DATE',
	'INVALID_ARGUMENT: Must be one of: F, M': 'INVALID_GENDER',
	'INVALID_ARGUMENT: Invalid region': 'INVALID_REGION',
	'INVALID_ARGUMENT: Invalid timezone': 'INVALID_TIMEZONE',
	'INVALID_ARGUMENT: Invalid mii data': 'INVALID_MII_DATA'
};

export default defineEventHandler(async (event): Promise<void> => {
	await enforceRatelimit(event, bucket);

	const body = await readZodBody(event, AccountUpdateSchema);
	const auth = enforceLoggedIn(event);
	const grpc = useApiGrpcWithToken(event, auth.token);

	try {
		await grpc.updateUserData({
			gender: body.gender,
			birthday: body.birthday,
			region: body.region,
			timezone: body.timezone,
			mii: body.mii,
			serverAccessLevel: body.serverAccessLevel
		});
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
