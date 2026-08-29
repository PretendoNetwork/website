import { ClientError } from 'nice-grpc';
import { PasswordUpdateSchema } from '~~/shared/api-types';
import type { ApiErrorCodes } from '~~/shared/errors';

const bucket = createRatelimitBucket({
	id: 'update-password',
	points: 15,
	durationSec: 5 * 60, // 5 minutes
	blockDurationSec: 1 * 60 * 60 // 1 hour
});

const errors: Record<string, ApiErrorCodes> = {
	'INVALID_ARGUMENT: Password must be between 6 and 16 characters long': 'INVALID_PASSWORD_LENGTH',
	'INVALID_ARGUMENT: Password cannot be the same as username': 'INVALID_PASSWORD_USERNAME',
	'INVALID_ARGUMENT: Password must have combination of letters, numbers, and/or punctuation characters': 'INVALID_PASSWORD_COMBOS',
	'INVALID_ARGUMENT: Password may not have 3 repeating characters': 'INVALID_PASSWORD_REPEATING',
	'INVALID_ARGUMENT: Passwords do not match': 'INVALID_PASSWORD_NO_MATCH',
	'INVALID_ARGUMENT: Password is incorrect': 'INVALID_PASSWORD'
};

export default defineEventHandler(async (event): Promise<void> => {
	await enforceRatelimit(event, bucket);

	const body = await readZodBody(event, PasswordUpdateSchema);
	const auth = enforceLoggedIn(event);
	const grpc = useApiGrpcWithToken(event, auth.token);

	try {
		await grpc.updatePassword({
			oldPassword: body.oldPassword,
			newPassword: body.newPassword,
			newPasswordConfirm: body.newPasswordConfirm
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
