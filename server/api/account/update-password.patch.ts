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
	'INVALID_ARGUMENT: Password must be between 6 and 16 characters long': 'PASSWORD_INVALID_LENGTH',
	'INVALID_ARGUMENT: Password cannot be the same as username': 'PASSWORD_NOT_USERNAME',
	'INVALID_ARGUMENT: Password must have combination of letters, numbers, and/or punctuation characters': 'PASSWORD_NEEDS_CHARS',
	'INVALID_ARGUMENT: Password may not have 3 repeating characters': 'PASSWORD_REPEATED_CHARS',
	'INVALID_ARGUMENT: Passwords do not match': 'PASSWORDS_DO_NOT_MATCH',
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
