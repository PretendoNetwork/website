import { FetchError } from 'ofetch';

interface RegisterCCResponse { // TODO: this is the same as the login response. figure out where we should put types and merge into AuthCCReponse!
	refresh_token: string;
	access_token: string;
	token_type: string;
	expires_in: number;
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	try {
		const apiResponse = await $fetch<RegisterCCResponse>(`/v1/register`, {
			method: 'POST',
			baseURL: useRuntimeConfig(event).apiBase,
			body: body
		});

		setCookie(event, 'refresh_token', apiResponse.refresh_token);
		setCookie(event, 'access_token', apiResponse.access_token);
		setCookie(event, 'token_type', apiResponse.token_type);

		setResponseStatus(event, 200);
		event.node.res.end();
	} catch (error: unknown) {
		if (error instanceof FetchError) {
			setResponseStatus(event, error.status, error.data.error);
		} else {
			setResponseStatus(event, 500);
		}

		event.node.res.end();
	}
});
