import { ClientError } from 'nice-grpc';
import { EmailVerifySchema } from '~~/shared/api-types';
import type { ApiErrorCodes } from '~~/shared/errors';

const bucket = createRatelimitBucket({
	id: 'verify-email',
	points: 20,
	durationSec: 30 * 60, // 30 minutes
	blockDurationSec: 1 * 60 * 60 // 1 hour
});

const errors: Record<string, ApiErrorCodes> = {
	'INVALID_ARGUMENT: Missing email token': 'MISSING_EMAIL_TOKEN',
	'INVALID_ARGUMENT: Invalid email token': 'INVALID_EMAIL_TOKEN'
};

export default defineEventHandler(async (event): Promise<void> => {
	await enforceRatelimit(event, bucket);

	const body = await readZodBody(event, EmailVerifySchema);
	const grpc = useApiGrpc(event);

	try {
		await grpc.verifyEmail({
			token: body.token
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
