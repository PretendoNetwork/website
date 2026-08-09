import { ResetPasswordSchema } from '~~/shared/api-types';

export default defineEventHandler(async (event): Promise<void> => {
	const body = await readZodBody(event, ResetPasswordSchema);
	const grpc = useApiGrpc(event);

	await grpc.resetPassword({
		password: body.password,
		passwordConfirm: body.passwordConfirm,
		token: body.resetToken
	});
});
