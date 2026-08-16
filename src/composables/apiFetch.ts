export const apiFetch = $fetch.create({
	onRequest({ options }) {
		const tokens = useAuthStore().getTokens();
		if (tokens) {
			options.headers.set('Authorization', 'Bearer ' + tokens.accessToken);
		}
	},
	async onResponseError({ response }) {
		if (response.status === 401) {
			await navigateTo('/account/login');
		}
	}
});

export const useApiFetch = createUseFetch({
	$fetch: apiFetch
});
