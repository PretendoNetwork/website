import { ResetPasswordSchema } from '~~/shared/api-types';
import type { ApiErrorCodes } from '~~/shared/errors';

const errors: Record<string, ApiErrorCodes> = {
	'Missing token': 'INVALID_INPUT',
	'Invalid token': 'INVALID_INPUT',
	'Token expired': 'INVALID_INPUT',
	'Invalid token. No user found': 'INVALID_INPUT',
	'Must enter a password': 'PASSWORD_INVALID_LENGTH',
	'Password is too long': 'PASSWORD_INVALID_LENGTH',
	'Password is too short': 'PASSWORD_INVALID_LENGTH',
	'Password cannot be the same as username': 'PASSWORD_NOT_USERNAME',
	'Password must have combination of letters, numbers, and/or punctuation characters': 'PASSWORD_NEEDS_CHARS',
	'Password may not have 3 repeating characters': 'PASSWORD_REPEATED_CHARS',
	'Passwords do not match': 'PASSWORDS_DO_NOT_MATCH'
};

export default defineEventHandler(async (event): Promise<void> => {
	const body = await readZodBody(event, ResetPasswordSchema);
	const apiFetch = useHttpApi(event);

	// The GRPC version requires a login token, which the user doesnt have when resetting password, so we're using the HTTP api
	try {
		await apiFetch('/v1/reset-password', {
			method: 'POST',
			body: JSON.stringify({
				password: body.password,
				password_confirm: body.passwordConfirm,
				token: body.resetToken
			}),
			headers: {
				'Content-type': 'application/json'
			}
		});
	}	catch (err: any) {
		const data = err?.data;
		let errorCode: ApiErrorCodes = 'UNHANDLED_ERROR';

		if (typeof data === 'object' && data?.error) {
			errorCode = errors[data.error] ?? 'UNHANDLED_ERROR';
		}

		throw createApiError(errorCode);
	}
});
