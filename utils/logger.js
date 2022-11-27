import fs from 'fs-extra';
import chalk from 'chalk';

const base = './logs';
fs.ensureDirSync(base);

const writeStreams = {
	success: fs.createWriteStream(`${base}/success.log`),
	error: fs.createWriteStream(`${base}/error.log`),
	warn: fs.createWriteStream(`${base}/warn.log`),
	info: fs.createWriteStream(`${base}/info.log`),
};

const time = () => {
	const date = new Date();
	return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
};

function success(message) {
	const logLine = `[${time()}] [SUCCESS]: ${message}`;
	writeStreams.success.write(`${logLine}\n`);

	console.log(chalk.green.bold(logLine));
}

function error(message) {
	const logLine = `[${time()}] [ERROR]: ${message}`;
	writeStreams.error.write(`${logLine}\n`);

	console.log(chalk.red.bold(logLine));
}

function warn(message) {
	const logLine = `[${time()}] [WARN]: ${message}`;
	writeStreams.warn.write(`${logLine}\n`);

	console.log(chalk.yellow.bold(logLine));
}

function info(message) {
	const logLine = `[${time()}] [INFO]: ${message}`;
	writeStreams.info.write(`${logLine}\n`);

	console.log(chalk.cyan.bold(logLine));
}

const logger = {
	success,
	error,
	warn,
	info,
};
export default logger;
