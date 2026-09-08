import { ClientError } from 'nice-grpc';
import { RegisterSchema } from '#shared/api-types';
import type { ApiErrorCodes } from '~~/shared/errors';
import type { ApiAuthLogin } from '#shared/api-types';

const bucket = createRatelimitBucket({
	id: 'register',
	points: 15,
	durationSec: 5 * 60, // 5 minutes
	blockDurationSec: 1 * 60 * 60 // 1 hour
});

const errors: Record<string, ApiErrorCodes> = {
	'INVALID_ARGUMENT: Captcha verification failed': 'INVALID_CAPTCHA',
	'INVALID_ARGUMENT: Invalid email address': 'INVALID_EMAIL',
	'INVALID_ARGUMENT: Username is too short': 'USERNAME_TOO_SHORT',
	'INVALID_ARGUMENT: Username is too long': 'USERNAME_TOO_LONG',
	'INVALID_ARGUMENT: Username contains invalid characters': 'USERNAME_INVALID_CHARS',
	'INVALID_ARGUMENT: Username cannot begin with punctuation characters': 'USERNAME_INVALID_CHARS',
	'INVALID_ARGUMENT: Username cannot end with punctuation characters': 'USERNAME_INVALID_CHARS',
	'INVALID_ARGUMENT: Two or more punctuation characters cannot be used in a row': 'USERNAME_INVALID_CHARS',
	'INVALID_ARGUMENT: PNID already in use': 'USERNAME_IN_USE',
	'INVALID_ARGUMENT: Mii name too long': 'MIINAME_TOO_LONG',
	'INVALID_ARGUMENT: Password must be between 6 and 16 characters long': 'PASSWORD_INVALID_LENGTH',
	'INVALID_ARGUMENT: Password cannot be the same as username': 'PASSWORD_NOT_USERNAME',
	'INVALID_ARGUMENT: Password must have combination of letters, numbers, and/or punctuation characters': 'PASSWORD_NEEDS_CHARS',
	'INVALID_ARGUMENT: Password may not have 3 repeating characters': 'PASSWORD_REPEATED_CHARS',
	'INVALID_ARGUMENT: Passwords do not match': 'PASSWORDS_DO_NOT_MATCH'

};

function getCutoffDateForAge(today: Date, age: number) {
	return new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
}

function assertAge(birthDate: string | undefined) {
	if (!birthDate) {
		throw createApiError('INVALID_INPUT');
	}
	const date = new Date(birthDate);
	const today = new Date();

	// Prevent users below 13
	if (date > getCutoffDateForAge(today, 13)) {
		throw createApiError('UNDER_THIRTEEN');
	}
}

export default defineEventHandler(async (event): Promise<ApiAuthLogin> => {
	await enforceRatelimit(event, bucket);
	const body = await readZodBody(event, RegisterSchema);
	const grpc = useApiGrpc(event);
	assertAge(body.birthday);

	try {
		// TODO Add ip
		const res = await grpc.register({
			email: body.email,
			miiName: body.miiName,
			captchaResponse: body.captchaResponse,
			username: body.username,
			password: body.password,
			passwordConfirm: body.passwordConfirm
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
