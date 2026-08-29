import { request } from 'undici';
import type { Dispatcher } from 'undici';
import type { H3Event } from 'h3';

export type HttpApiOptions = {
	headers?: HeadersInit; body?: string; method?: Dispatcher.HttpMethod;
};
export type HttpApiFetch = <T>(url: string, ops?: HttpApiOptions) => Promise<T>;

export function useHttpApi(event: H3Event, token?: string): HttpApiFetch {
	const config = useRuntimeConfig(event);

	async function httpFetch<T>(url: string, opts: HttpApiOptions = {}): Promise<T> {
		const headers = new Headers(opts.headers);
		headers.set('Host', config.apiBaseHost); // Can't use fetch due to Host header overwriting
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}

		const urlWithBase = new URL(url, config.apiBase);
		const response = await request(urlWithBase, {
			method: opts.method,
			headers: Object.fromEntries(headers.entries()),
			body: opts?.body
		});

		if (response.statusCode >= 400) {
			const err = new Error(`Request failed with ${response.statusCode}`);
			try {
				if (response.headers['content-type']?.includes('application/json')) {
					(err as any).data = await response.body.json();
				} else {
					(err as any).data = await response.body.text();
				}
			} catch {
				// It's already errored, we don't need to know the body
			}
			throw err;
		}

		return await response.body.json() as T;
	}

	return httpFetch;
}
