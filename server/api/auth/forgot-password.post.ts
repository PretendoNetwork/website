import { hcaptchaVerify } from "~~/server/utils/hcaptcha";
import { ForgotPasswordSchema } from "~~/shared/api-types";

export default defineEventHandler(async (event): Promise<void> => {
	const body = await readZodBody(event, ForgotPasswordSchema);
	const grpc = useApiGrpc(event);

	const captchaResult = await hcaptchaVerify(event, body.captchaResponse);
	if (!captchaResult) throw createError({
		status: 400,
		message: 'Invalid captcha',
	});

	await grpc.forgotPassword({
		emailAddressOrUsername: body.emailOrPassword,
	})
});
