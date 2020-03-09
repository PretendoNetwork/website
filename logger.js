const fs = require('fs-extra');
require('colors');

class Logger {
	constructor(root = '') {
		fs.ensureDirSync(`${root}/logs`);

		this.root = root;
		this.streams = {
			latest: fs.createWriteStream(`${this.root}/logs/latest.log`),
			success: fs.createWriteStream(`${this.root}/logs/success.log`),
			error: fs.createWriteStream(`${this.root}/logs/error.log`),
			warn: fs.createWriteStream(`${this.root}/logs/warn.log`),
			info: fs.createWriteStream(`${this.root}/logs/info.log`)
		};
	}
	

	success(input) {
		const time = new Date();
		input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [SUCCESS]: ${input}`;
		this.streams.success.write(`${input}\n`);

		console.log(`${input}`.green.bold);
	}

	error(input) {
		const time = new Date();
		input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [ERROR]: ${input}`;
		this.streams.error.write(`${input}\n`);

		console.log(`${input}`.red.bold);
	}

	warn(input) {
		const time = new Date();
		input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [WARN]: ${input}`;
		this.streams.warn.write(`${input}\n`);

		console.log(`${input}`.yellow.bold);
	}

	info(input) {
		const time = new Date();
		input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [INFO]: ${input}`;
		this.streams.info.write(`${input}\n`);

		console.log(`${input}`.cyan.bold);
	}
}

const logger = new Logger(__dirname);

module.exports = logger;