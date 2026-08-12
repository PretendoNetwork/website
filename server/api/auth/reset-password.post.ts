import { ResetPasswordSchema } from '~~/shared/api-types';

export default defineEventHandler(async (event): Promise<void> => {
	const body = await readZodBody(event, ResetPasswordSchema);
	const apiFetch = useHttpApi(event);

	// The GRPC version requires a login token, which the user doesnt have when resetting password, so we're using the HTTP api
	await apiFetch('/v1/reset-password', {
		method: 'POST',
		body: JSON.stringify({
			password: body.password,
			password_confirm: body.passwordConfirm,
			token: body.resetToken
		}),
		headers: {
			'Content-type': 'application/json'
		}
	});
});
