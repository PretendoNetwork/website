const winston = require('winston');

const logger = winston.createLogger({
	level: 'verbose',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(log => {
			return `${log.timestamp} | ${log.level}: ${log.message}`;
		})
	),
	transports: [
		new winston.transports.Console({ colorize: true }),
		new winston.transports.File({
			colorize: false,
			json: false,
			filename: `${__dirname}/logs/events.log`
		}),
		new winston.transports.File({
			colorize: false,
			json: false,
			filename: `${__dirname}/logs/error.log`,
			level: 'error'
		}),
		new winston.transports.File({
			colorize: false,
			json: false,
			filename: `${__dirname}/logs/warn.log`,
			level: 'warn'
		}),
		new winston.transports.File({
			colorize: false,
			json: false,
			filename: `${__dirname}/logs/debug.log`,
			level: 'debug'
		})
	]
});

winston.add(logger);

module.exports = winston;