import type { H3Event } from 'h3'
import hcaptcha from 'hcaptcha'

export async function hcaptchaVerify(event: H3Event, captchaResponse: string | null | undefined): Promise<boolean> {
	const config = useRuntimeConfig(event);
	if (!config.hcaptchaSiteKey) return true; // No captcha is configured, always valid
	if (!config.hcaptchaSecretKey) throw new Error("Hcaptcha not configured correctly, missing secret key");

	if (!captchaResponse) return false; // No captcha filled in, invalid
	const captchaVerify = await hcaptcha.verify(config.hcaptchaSiteKey, captchaResponse, undefined, config.hcaptchaSiteKey);

	if (!captchaVerify.success) return false; // Invalid captcha response
	return true;
}
