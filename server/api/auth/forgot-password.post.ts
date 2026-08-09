import { ForgotPasswordSchema } from "~~/shared/api-types";

export default defineEventHandler(async (event): Promise<void> => {
	const body = await readZodBody(event, ForgotPasswordSchema);
	const grpc = useApiGrpc(event);

	await grpc.forgotPassword({
		emailAddressOrUsername: body.emailOrPassword,
	})
});
