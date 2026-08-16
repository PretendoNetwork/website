const apiErrorCodes = {
	UNPARSABLE_ERROR: 'Fatal exception!',
	UNHANDLED_ERROR: 'Something went wrong',
	INVALID_INPUT: 'Invalid input',
	INTEGRATION_DISABLED: 'Integration with this service is disabled',
	STAFF_NO_DONATE: 'Staff members do not need to purchase tiers',
	INVALID_CAPTCHA: 'Invalid captcha, try again',
	INVALID_USERNAME: 'Could not find user',
	INVALID_PASSWORD: 'Incorrect password',
	UNAUTHENTICATED: 'This request needs authentication'
} as const;

export type ApiErrorCodes = keyof typeof apiErrorCodes;

export const apiErrorCodeStatus: Record<ApiErrorCodes, number> = {
	UNPARSABLE_ERROR: 500,
	UNHANDLED_ERROR: 500,
	INVALID_INPUT: 400,
	INTEGRATION_DISABLED: 500,
	STAFF_NO_DONATE: 400,
	INVALID_CAPTCHA: 400,
	INVALID_USERNAME: 400,
	INVALID_PASSWORD: 400,
	UNAUTHENTICATED: 401
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
