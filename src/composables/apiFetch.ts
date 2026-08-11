export const apiFetch = $fetch.create({
	onRequest({ options }) {
		const token = useAuthStore().getToken();
		if (token) {
			options.headers.set('Authorization', 'Bearer ' + token);
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
