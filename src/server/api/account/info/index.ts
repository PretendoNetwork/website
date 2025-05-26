import { FetchError } from 'ofetch';

interface InfoCCResponse { // TODO: de-dupe this. don't know where to coalesce types. feels like we should have a library for this but this should be handled when we switch to gRPC later
	username: string;
	mii: {
		name: string;
		image_url: string;
	};
}

export default defineEventHandler(async (event) => {
	try {
		const cookies = parseCookies(event);

		return await $fetch<InfoCCResponse>(`/v1/user`, {
			method: 'GET',
			baseURL: useRuntimeConfig(event).apiBase,
			headers: { Authorization: `${cookies?.token_type} ${cookies?.access_token}` }
		});
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
