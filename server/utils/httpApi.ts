import { request } from 'undici';
import type { Dispatcher } from 'undici';

export function useHttpApi(event: H3Event, token?: string) {
	const config = useRuntimeConfig(event);

	return (url: string, opts: { headers?: HeadersInit; body?: string; method?: Dispatcher.HttpMethod } = {}) => {
		const headers = new Headers(opts.headers);
		headers.set('Host', config.apiBaseHost); // Can't use fetch due to Host header overwriting
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}

		const urlWithBase = new URL(url, config.apiBase);
		return request(urlWithBase, {
			method: opts.method,
			headers: Object.fromEntries(headers.entries()),
			body: opts?.body
		});
	};
}
