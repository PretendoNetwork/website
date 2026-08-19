import { apiErrorCodeStatus, getTextForApiErrorCode } from '~~/shared/errors';
import type { ApiErrorCodes, ApiError } from '~~/shared/errors';

export function createApiError(code: ApiErrorCodes) {
	const err = createApiErrorBase(code);
	return createError({
		statusCode: apiErrorCodeStatus[err.code],
		message: err.message,
		data: err
	});
}

export function createApiErrorBase(code: ApiErrorCodes): ApiError {
	return {
		code,
		message: getTextForApiErrorCode(code)
	};
}
