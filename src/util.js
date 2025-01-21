const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');
const got = require('got');
const { marked } = require('marked');
const { REST: DiscordRest } = require('@discordjs/rest');
const { Routes: DiscordRoutes } = require('discord-api-types/v10');
const merge = require('lodash.merge');
const config = require('./config');
const logger = require('./logger');
const baseLocale = require(`${__dirname}/../locales/en_US.json`);

const discordRest = new DiscordRest({ version: '10' }).setToken(config.discord.bot_token);

function fullUrl(request) {
	return `${request.protocol}://${request.hostname}${request.originalUrl}`;
}

function getLocale(locale) {
	const localeFileName = locale.replace('-', '_');

	const path = `${__dirname}/../locales/${localeFileName}.json`;

	if (fs.pathExistsSync(path)) {
		const selectedLocale = require(path);
		const finalLocale = merge({}, baseLocale, selectedLocale);

		return finalLocale;
	}

	logger.warn(`Could not find locale ${localeFileName}! Loading en_US`);

	return baseLocale;
}

function getRawDocs(locale, subpath, pageName) {
	const localePath = path.join(__dirname, '../docs', locale.replace('-', '_'), subpath, `${pageName}.md`);
	const defaultPath = path.join(__dirname, '../docs', 'en_US', subpath, `${pageName}.md`);

	if (fs.existsSync(localePath)) {
		return {
			content: parseDocs(fs.readFileSync(localePath, 'utf8')),
			MDLocale: locale
		};
	} else if (fs.existsSync(defaultPath)) {
		return {
			content: parseDocs(fs.readFileSync(defaultPath, 'utf8')),
			MDLocale: 'en-US'
		};
	}

	return {
		content: null,
		MDLocale: null
	};
}

function parseDocs(rawDocs) {
	if (!rawDocs) {
		return null;
	}

	let markedContent = marked(rawDocs);
	markedContent = markedContent.replaceAll(/\[yt-iframe\]\(.{11}\)/g, (match) => {
		const videoIDRegex = /(?<=\[yt-iframe\]\().*(?=\))/g;
		const videoID = match.match(videoIDRegex)[0];
		return `<div class="aspectratio-fallback"><iframe src="https://www.youtube-nocookie.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
	});

	const htmlContent = marked.parse(markedContent);
	return htmlContent;
}

function apiGetRequest(path, headers) {
	return got.get(`${config.api_base}${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false // Needed for self-signed certificates on localhost testing
		},
		headers
	});
}

function apiPostRequest(path, headers, json) {
	return got.post(`${config.api_base}${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

function apiDeleteRequest(path, headers, json) {
	return got.delete(`${config.api_base}${path}`, {
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

async function register(registerData) {
	const apiResponse = await apiPostRequest('/v1/register', {}, registerData);

	if (apiResponse.statusCode !== 200) {
		throw new Error(apiResponse.body.error);
	}

	return apiResponse.body;
}

async function login(username, password) {
	const apiResponse = await apiPostRequest('/v1/login', {}, {
		username,
		password,
		grant_type: 'password'
	});

	if (apiResponse.statusCode !== 200) {
		throw new Error(apiResponse.body.error);
	}

	return apiResponse.body;
}

async function forgotPassword(forgotPasswordData) {
	const apiResponse = await apiPostRequest('/v1/forgot-password', {}, forgotPasswordData);

	if (apiResponse.statusCode !== 200) {
		throw new Error(apiResponse.body.error);
	}

	return apiResponse.body;
}

async function refreshLogin(request, response) {
	const apiResponse = await apiPostRequest('/v1/login', {}, {
		refresh_token: request.cookies.refresh_token,
		grant_type: 'refresh_token'
	});

	if (apiResponse.statusCode !== 200) {
		// TODO: Error message
		throw new Error('Bad');
	}

	const tokens = apiResponse.body;

	response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
	response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
	response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

	request.cookies.refresh_token = tokens.refresh_token;
	request.cookies.access_token = tokens.access_token;
	request.cookies.token_type = tokens.token_type;
}

async function getUserAccountData(request, response, fromRetry = false) {
	const apiResponse = await apiGetRequest('/v1/user', {
		Authorization: `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200 && fromRetry === true) {
		// TODO: Error message
		throw new Error('Bad');
	}

	if (apiResponse.statusCode !== 200) {
		await refreshLogin(request, response);
		return await getUserAccountData(request, response, true);
	}

	return apiResponse.body;
}

async function updateDiscordConnection(discordUser, request, response, fromRetry = false) {
	const apiResponse = await apiPostRequest('/v1/connections/add/discord', {
		Authorization: `${request.cookies.token_type} ${request.cookies.access_token}`
	}, {
		data: {
			id: discordUser.id
		}
	});

	if (apiResponse.statusCode !== 200 && fromRetry === true) {
		// TODO: Error message
		throw new Error('Bad');
	}

	if (apiResponse.statusCode !== 200) {
		await refreshLogin(request, response);
		await updateDiscordConnection(discordUser, request, response, true);
	}
}

async function removeDiscordConnection(request, response, fromRetry = false) {
	const apiResponse = await apiDeleteRequest('/v1/connections/remove/discord', {
		Authorization: `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200 && fromRetry === true) {
		// TODO: Error message
		throw new Error('Bad');
	}

	if (apiResponse.statusCode !== 200) {
		await refreshLogin(request, response);
		await removeDiscordConnection(request, response, true);
	}
}

function nintendoPasswordHash(password, pid) {
	const pidBuffer = Buffer.alloc(4);
	pidBuffer.writeUInt32LE(pid);

	const unpacked = Buffer.concat([
		pidBuffer,
		Buffer.from('\x02\x65\x43\x46'),
		Buffer.from(password)
	]);

	const hashed = crypto.createHash('sha256').update(unpacked).digest().toString('hex');

	return hashed;
}

async function assignDiscordMemberSupporterRole(memberId, roleId) {
	if (memberId && memberId.trim() !== '') {
		await discordRest.put(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, config.discord.roles.supporter));
		await discordRest.put(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, roleId));
	}
}

async function assignDiscordMemberTesterRole(memberId) {
	if (memberId && memberId.trim() !== '') {
		await discordRest.put(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, config.discord.roles.tester));
	}
}

async function removeDiscordMemberSupporterRole(memberId, roleId) {
	if (memberId && memberId.trim() !== '') {
		await discordRest.delete(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, config.discord.roles.supporter));
		await discordRest.delete(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, roleId));
	}
}

async function removeDiscordMemberTesterRole(memberId) {
	if (memberId && memberId.trim() !== '') {
		await discordRest.delete(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, config.discord.roles.tester));
	}
}

function signDiscoursePayload(payload) {
	return crypto.createHmac('sha256', config.discourse.sso.secret).update(payload).digest('hex');
}

module.exports = {
	fullUrl,
	getLocale,
	getRawDocs,
	parseDocs,
	apiGetRequest,
	apiPostRequest,
	apiDeleteRequest,
	register,
	login,
	forgotPassword,
	refreshLogin,
	getUserAccountData,
	updateDiscordConnection,
	removeDiscordConnection,
	nintendoPasswordHash,
	assignDiscordMemberSupporterRole,
	assignDiscordMemberTesterRole,
	removeDiscordMemberSupporterRole,
	removeDiscordMemberTesterRole,
	signDiscoursePayload
};
