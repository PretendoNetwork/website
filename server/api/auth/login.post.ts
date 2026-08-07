import z from 'zod';
import { ServerError } from 'nice-grpc';

export type ApiAuthLogin = {
	accessToken: string
	refreshToken: string;
}

const LoginSchema = z.object({
	username: z.string(),
	password: z.string(),
})
export type ApiAuthLoginRequest = z.infer<typeof LoginSchema>

export default defineEventHandler(async (event): Promise<ApiAuthLogin> => {
	const body = await readZodBody(event, LoginSchema);
	const grpc = useGrpc(event);

	try {
		const res = await grpc.login({
			username: body.username,
			password: body.password,
			grantType: 'password'
		});

		return {
			accessToken: res.accessToken,
			refreshToken: res.refreshToken,
		}
	} catch (error: unknown) {
		if (error instanceof ServerError) {
			if (error.details === 'INVALID_ARGUMENT: User not found') {
				throw createError({
					status: 400,
					statusText: 'User not found',
				})
			}
			if (error.details === 'INVALID_ARGUMENT: Password is incorrect') {
				throw createError({
					status: 400,
					statusText: 'Password was incorrect',
				})
			}
		}
		throw error;
	}
});
