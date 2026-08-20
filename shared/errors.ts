const apiErrorCodes = {
	UNPARSABLE_ERROR: 'Fatal exception!',
	RATELIMITED: 'Too many requests!',
	UNHANDLED_ERROR: 'Something went wrong',
	INVALID_INPUT: 'Invalid input',
	INTEGRATION_DISABLED: 'Integration with this service is disabled',
	STAFF_NO_DONATE: 'Staff members do not need to purchase tiers',
	INVALID_CAPTCHA: 'Invalid captcha, try again',
	INVALID_USERNAME: 'Could not find user',
	INVALID_PASSWORD: 'Incorrect password',
	UNAUTHENTICATED: 'This request needs authentication',
	UNDER_THIRTEEN: 'Must be 13 or older to use these services',
	INVALID_EMAIL: 'Invalid email address',
	USERNAME_TOO_SHORT: 'Username is too short',
	USERNAME_TOO_LONG: 'Username is too long',
	USERNAME_INVALID_CHARS: 'Username contains invalid characters',
	USERNAME_IN_USE: 'PNID already in use',
	MIINAME_TOO_LONG: 'Mii name too long',
	INVALID_PASSWORD_INPUT: 'Password must be between 6 and 16 characters long',
	INVALID_PASSWORD_NO_MATCH: 'Passwords do not match',
	ACCOUNT_DELETED: 'Account has been deleted',
	INVALID_ACCESS_LEVEL: 'Invalid access level',
	BANNED: 'Account is banned',
	INSUFFICIENT_ACCESS_LEVEL: 'Do not have permission to enter this environment',
	INVALID_DATE: 'Invalid date',
	INVALID_GENDER: 'Invalid gender',
	INVALID_REGION: 'Invalid region',
	INVALID_TIMEZONE: 'Invalid timezone',
	INVALID_MII_DATA: 'Invalid mii data'
} as const;

export type ApiErrorCodes = keyof typeof apiErrorCodes;

export const apiErrorCodeStatus: Record<ApiErrorCodes, number> = {
	UNPARSABLE_ERROR: 500,
	RATELIMITED: 429,
	UNHANDLED_ERROR: 500,
	INVALID_INPUT: 400,
	INTEGRATION_DISABLED: 500,
	STAFF_NO_DONATE: 400,
	INVALID_CAPTCHA: 400,
	INVALID_USERNAME: 400,
	INVALID_PASSWORD: 400,
	UNAUTHENTICATED: 401,
	UNDER_THIRTEEN: 400,
	ACCOUNT_DELETED: 400,
	INVALID_EMAIL: 400,
	INVALID_PASSWORD_INPUT: 400,
	INVALID_PASSWORD_NO_MATCH: 400,
	MIINAME_TOO_LONG: 400,
	USERNAME_IN_USE: 400,
	USERNAME_INVALID_CHARS: 400,
	USERNAME_TOO_LONG: 400,
	USERNAME_TOO_SHORT: 400,
	INVALID_ACCESS_LEVEL: 400,
	BANNED: 403,
	INSUFFICIENT_ACCESS_LEVEL: 403,
	INVALID_DATE: 400,
	INVALID_GENDER: 400,
	INVALID_REGION: 400,
	INVALID_TIMEZONE: 400,
	INVALID_MII_DATA: 400
};

export function getTextForApiErrorCode(code: ApiErrorCodes): string {
	return apiErrorCodes[code];
}

export type ApiError = {
	code: ApiErrorCodes;
	message: string;
};

export function getApiError(error: any): ApiError {
	if (error?.code) {
		return error as ApiError;
	}

	if (error?.data?.code) {
		return error.data as ApiError;
	}

	return {
		code: 'UNPARSABLE_ERROR',
		message: getTextForApiErrorCode('UNPARSABLE_ERROR')
	};
}
