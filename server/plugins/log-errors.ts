import type { H3Error } from 'h3';

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook('error', (err, { event }) => {
		const error = err as Partial<H3Error>;
		const statusCode = error.statusCode ?? 500;

		// Skip expected client errors (404, 401, 422, redirects, ...).
		if (statusCode < 500) {
			return;
		}

		const where = event ? `${event.method} ${event.path}` : 'non-request';
		const tag = error.unhandled ? '[unhandled]' : '';

		console.error(`[server error] ${tag} ${statusCode} ${where}:`, err);
	});
});
