import * as crypto from 'crypto';
import { REST as DiscordRest } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { FetchError } from 'ofetch';
import DiscordOauth2 from 'discord-oauth2';
import type { APIUser } from 'discord-api-types/v10';

interface InfoCCResponse { // TODO: de-dupe
	username: string;
	access_level: number;
	mii: {
		name: string;
		image_url: string;
	};
	connections: {
		stripe?: {
			tier_name?: string;
			tier_level?: string;
		};
		discord?: {
			id: string;
		};
	};
	birthdate: string;
	gender: string;
	country: string;
	timezone: {
		name: string;
	};
	server_access_level: string;
	email: {
		address: string;
	};
}

export default defineEventHandler(async (event) => {
	const discordRest = new DiscordRest({ version: '10' }).setToken(useRuntimeConfig(event).discord.botToken);
	const discordOauth = new DiscordOauth2({
		clientId: useRuntimeConfig(event).discord.clientID,
		clientSecret: useRuntimeConfig(event).discord.clientSecret,
		redirectUri: `http://localhost:3000/account/connect/discord`,
		version: 'v10'
	});

	try {
		const cookies = parseCookies(event);

		const accountInfo = await $fetch<InfoCCResponse>(`/v1/user`, {
			method: 'GET',
			baseURL: useRuntimeConfig(event).apiBase,
			headers: { Authorization: `${cookies?.token_type} ${cookies?.access_token}` }
		});

		if (!accountInfo.connections.discord?.id) {
			return {
				authLink: discordOauth.generateAuthUrl({
					scope: ['identify', 'guilds'],
					state: crypto.randomBytes(16).toString('hex')
				})
			};
		}

		return await discordRest.get(Routes.user(accountInfo.connections.discord?.id)) as APIUser;
	} catch (error: unknown) {
		console.log(error);
		if (error instanceof FetchError) {
			setResponseStatus(event, error.status, error.data.error);
		} else {
			setResponseStatus(event, 500);
		}

		event.node.res.end();

		return;
	}
});
