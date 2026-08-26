import { ClientError } from 'nice-grpc';
import { EmailUpdateSchema } from '~~/shared/api-types';
import type { ApiErrorCodes } from '~~/shared/errors';

const bucket = createRatelimitBucket({
	id: 'update-email',
	points: 3,
	durationSec: 30 * 60, // 30 minutes
	blockDurationSec: 1 * 60 * 60 // 1 hour
});

const errors: Record<string, ApiErrorCodes> = {
	'INVALID_ARGUMENT: Must provide new email address': 'UNPARSABLE_ERROR',
	'INVALID_ARGUMENT: Invalid email address': 'INVALID_EMAIL',
	'INVALID_ARGUMENT: New email address must differ from current': 'EMAIL_UNCHANGED'
};

export default defineEventHandler(async (event): Promise<void> => {
	await enforceRatelimit(event, bucket);

	const body = await readZodBody(event, EmailUpdateSchema);
	const auth = enforceLoggedIn(event);
	const grpc = useApiGrpcWithToken(event, auth.token);

	try {
		await grpc.updateEmail({
			email: body.email
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
