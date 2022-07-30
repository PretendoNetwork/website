const nodemailer = require('nodemailer');
const config = require('../config.json');

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: config.gmail.user,
		pass: config.gmail.pass
	}
});

async function sendMail(options) {
	options.from = config.gmail.from;

	return await transporter.sendMail(options);
}

module.exports = {
	sendMail
};
