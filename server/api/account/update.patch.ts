import { AccountUpdateSchema } from '~~/shared/api-types';

export default defineEventHandler(async (event): Promise<void> => {
	const body = await readZodBody(event, AccountUpdateSchema);
	const auth = enforceLoggedIn(event);
	const apiFetch = useHttpApi(event, auth.token);

	// There's no equivalent GRPC endpoint to use, so we're using the HTTP api
	await apiFetch('/v1/user', {
		method: 'POST',
		body: JSON.stringify({
			mii: body.mii,
			environment: body.environment
		}),
		headers: {
			'Content-type': 'application/json'
		}
	});
});
