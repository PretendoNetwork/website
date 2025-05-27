import { FetchError } from 'ofetch';

export default defineEventHandler(async (event) => {
	const cookies = parseCookies(event);

	try {
		await $fetch(`/v1/connections/remove/discord`, {
			method: 'DELETE',
			baseURL: useRuntimeConfig(event).apiBase,
			headers: { Authorization: `${cookies?.token_type} ${cookies?.access_token}` }
		});
	} catch (error: unknown) {
		console.log(error);
		if (error instanceof FetchError) {
			setResponseStatus(event, error.status, error.data.error);
		} else {
			setResponseStatus(event, 500);
		}

		event.node.res.end();

		return;
	}
});
