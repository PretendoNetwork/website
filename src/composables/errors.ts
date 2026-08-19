import { FetchError } from 'ofetch';
import { getApiError as baseGetApiError } from '~~/shared/errors';
import type { ApiError } from '~~/shared/errors';

export function getApiError(error: any): ApiError {
	if (error instanceof FetchError) {
		return baseGetApiError(error.data);
	}
	return baseGetApiError(error);
}
