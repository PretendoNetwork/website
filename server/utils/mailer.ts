import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type Mail from 'nodemailer/lib/mailer';
import type { Transporter } from 'nodemailer';
import type { H3Event } from 'h3';

let mailer: Mailer | null = null;

export type Mailer = {
	transport: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
	sendMail(ops: Mail.Options & Partial<SMTPTransport.Options>): Promise<SMTPTransport.SentMessageInfo>;
};

function buildMailer(transport: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>, from: Mail.Address): Mailer {
	return {
		transport,
		sendMail(ops) {
			return transport.sendMail({
				from,
				...ops
			});
		}
	};
}

export function useMailer(event: H3Event): Mailer | null {
	if (!mailer) {
		const config = useRuntimeConfig(event);
		if (config.smtpHost && config.smtpPort && config.smtpFromEmail) {
			const transport = createTransport({
				host: config.smtpHost,
				port: config.smtpPort,
				secure: config.smtpSecure,
				auth: {
					user: config.smtpUser ? config.smtpUser : undefined,
					pass: config.smtpPassword ? config.smtpPassword : undefined
				}
			});
			mailer = buildMailer(transport, {
				address: config.smtpFromEmail,
				name: config.smtpFromName ? config.smtpFromName : undefined
			});
		}
	}

	return mailer;
}
