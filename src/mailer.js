const nodemailer = require('nodemailer');
const aws = require('@aws-sdk/client-ses');
const config = require('./config');

let transporter;

if (config.email) {
	const ses = new aws.SES({
		apiVersion: '2010-12-01',
		region: config.email.ses.region,
		credentials: {
			accessKeyId: config.email.ses.key,
			secretAccessKey: config.email.ses.secret
		}
	});

	transporter = transporter = nodemailer.createTransport({
		SES: {
			ses,
			aws
		}
	});
}

async function sendMail(options) {
	if (transporter) {
		options.from = config.email.from;

		await transporter.sendMail(options);
	}
}

module.exports = {
	sendMail
};
