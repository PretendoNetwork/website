const fs = require('fs-extra');
require('colors');

const root = __dirname;
fs.ensureDirSync(`${root}/logs`);

const streams = {
	latest: fs.createWriteStream(`${root}/logs/latest.log`),
	success: fs.createWriteStream(`${root}/logs/success.log`),
	error: fs.createWriteStream(`${root}/logs/error.log`),
	warn: fs.createWriteStream(`${root}/logs/warn.log`),
	info: fs.createWriteStream(`${root}/logs/info.log`)
};

function success(input) {
	const time = new Date();
	input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [SUCCESS]: ${input}`;
	streams.success.write(`${input}\n`);

	console.log(`${input}`.green.bold);
}

function error(input) {
	const time = new Date();
	input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [ERROR]: ${input}`;
	streams.error.write(`${input}\n`);

	console.log(`${input}`.red.bold);
}

function warn(input) {
	const time = new Date();
	input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [WARN]: ${input}`;
	streams.warn.write(`${input}\n`);

	console.log(`${input}`.yellow.bold);
}

function info(input) {
	const time = new Date();
	input = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] [INFO]: ${input}`;
	streams.info.write(`${input}\n`);

	console.log(`${input}`.cyan.bold);
}

module.exports = {
	success,
	error,
	warn,
	info
};