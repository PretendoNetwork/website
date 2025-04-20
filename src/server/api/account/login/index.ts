import { FetchError } from 'ofetch';

type LoginCCResponse = {
	refresh_token: string;
	access_token: string;
	token_type: string;
	expires_in: number;
};

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	try {
		const apiResponse = await $fetch<LoginCCResponse>(`${useRuntimeConfig(event).apiBase}/v1/login`, {
			method: 'POST',
			body: { ...body, grant_type: 'password' }
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

		return;
	}
});
