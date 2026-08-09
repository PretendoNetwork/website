import { createTransport } from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { H3Event } from 'h3';

let transport: Transporter | null = null;

export function useMailer(event: H3Event): Transporter | null {
	if (!transport) {
		const config = useRuntimeConfig(event);
		if (config.smtpHost && config.smtpPort && config.smtpFromEmail) {
			transport = createTransport({
				from: {
					address: config.smtpFromEmail,
					name: config.smtpFromName ? config.smtpFromName : undefined
				},
				host: config.smtpHost,
				port: config.smtpPort,
				secure: config.smtpSecure,
				auth: {
					user: config.smtpUser ? config.smtpUser : undefined,
					pass: config.smtpPassword ? config.smtpPassword : undefined
				}
			});
		}
	}

	return transport;
}
