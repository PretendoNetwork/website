export function useHttpApi(event: H3Event) {
	const config = useRuntimeConfig(event);
	return $fetch.create({
		baseURL: config.public.apiBase,
	});
}
