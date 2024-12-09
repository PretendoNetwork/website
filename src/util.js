const path = require('path');
const fs = require('fs-extra');
const got = require('got');
const crypto = require('crypto');
const { marked } = require('marked');
const { REST: DiscordRest } = require('@discordjs/rest');
const { Routes: DiscordRoutes } = require('discord-api-types/v10');
const merge = require('lodash.merge');
const logger = require('./logger');
const config = require('../config.json');
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
			MDLocale: locale,
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
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers
	});
}

function apiPostRequest(path, headers, json) {
	return got.post(`${config.api_base}${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

function apiDeleteRequest(path, headers, json) {
	return got.delete(`${config.api_base}${path}`, {
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
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

async function getUserAccountData(request, response, fromRetry=false) {
	const apiResponse = await apiGetRequest('/v1/user', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
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

async function updateDiscordConnection(discordUser, request, response, fromRetry=false) {
	const apiResponse = await apiPostRequest('/v1/connections/add/discord', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
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
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
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

function createDiscoursePayload(nonce, accountData) {
	const groups = config.discourse.groups;

	const accessLevelGroupMapping = {
		0: {
			addGroups: '',
			removeGroups: `${groups.tester},${groups.moderator},${groups.developer}`
		},
		1: {
			addGroups: groups.tester,
			removeGroups: `${groups.moderator},${groups.developer}`
		},
		2: {
			addGroups: groups.moderator,
			removeGroups: `${groups.tester},${groups.developer}`
		},
		3: {
			addGroups: groups.developer,
			removeGroups: `${groups.tester},${groups.moderator}`
		}
	};

	const { addGroups, removeGroups } = accessLevelGroupMapping[accountData.access_level] || accessLevelGroupMapping[0];

	// * Discourse SSO Payload
	// * https://meta.discourse.org/t/official-single-sign-on-for-discourse-sso/13045

	// * Discourse REQUIRES unique emails, however we do not due to NN also
	// * not requiring unique email addresses. Email addresses, for now,
	// * are faked using the users PID. This will essentially disable email
	// * for the forum, but it's a bullet we have to bite for right now.
	// TODO - We can run our own SMTP server which maps fake emails (pid@pretendo.whatever) to users real emails
	return Buffer.from(new URLSearchParams({
		nonce: nonce,
		external_id: accountData.pid,
		email: `${accountData.pid}@invalid.com`, // * Hack to get unique emails
		username: accountData.username,
		name: accountData.mii.name,
		avatar_url: accountData.mii.image_url,
		avatar_force_update: true,
		add_groups: addGroups,
		remove_groups: removeGroups
	}).toString()).toString('base64');
}

function signDiscoursePayload(payload) {
	return crypto.createHmac('sha256', config.discourse.sso.secret).update(payload).digest('hex');
}

async function discourseUserExists(pid) {
	const response = await got.get(`${config.discourse.api.base_url}/users/by-external/${pid}.json`, {
		throwHttpErrors: false,
		responseType: 'json'
	});

	if (response.statusCode === 200) {
		return true;
	} else if (response.statusCode === 404) {
		return false;
	} else {
		throw new Error(`Discourse API error while checking if user ${pid} exists: ${response.statusCode} - ${JSON.stringify(response.body)}`);
	}
}

async function syncDiscourseSso(pnid) {
	// * Documentation: https://meta.discourse.org/t/sync-discourseconnect-user-data-with-the-sync-sso-route/84398
	const headers = {
		'Content-Type': 'multipart/form-data',
		'Api-Username': config.discourse.api.username,
		'Api-Key': config.discourse.api.key
	};

	const payload = createDiscoursePayload('', pnid);
	const post_data = {
		'sso': payload,
		'sig': signDiscoursePayload(payload)
	};

	return got.post(`${config.discourse.api.base_url}/admin/users/sync_sso`, {
		headers: headers,
		form: post_data,
		responseType: 'json'
	});
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
	createDiscoursePayload,
	signDiscoursePayload,
	discourseUserExists,
	syncDiscourseSso
};
