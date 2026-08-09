import { ApiAuthLogin, RegisterSchema } from "#shared/api-types"

export default defineEventHandler(async (event): Promise<ApiAuthLogin> => {
	const body = await readZodBody(event, RegisterSchema);
	const grpc = useApiGrpc(event);

	try {
		const res = await grpc.register({
			email: body.email,
			miiName: body.miiName,
			captchaResponse: body.captchaResponse,
			username: body.username,
			password: body.password,
			passwordConfirm: body.password
		});

		return {
			accessToken: res.accessToken,
			refreshToken: res.refreshToken
		};
	} catch (error: unknown) {
		throw error;
	}
});
