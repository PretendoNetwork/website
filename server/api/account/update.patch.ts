import { AccountUpdateSchema } from "~~/shared/api-types";

export default defineEventHandler(async (event): Promise<void> => {
	const body = await readZodBody(event, AccountUpdateSchema);
	const apiFetch = useHttpApi(event);
	const auth = enforceLoggedIn(event);

	// There's no equivalent GRPC endpoint to use, so we're using the HTTP api
	await apiFetch('/v1/user', {
		headers: {
			'Authorization': `Bearer ${auth.token}`,
		},
		body: {
			mii: body.mii,
			environment: body.environment
		}
	})
});
