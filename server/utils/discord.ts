import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import type { H3Event } from 'h3';

type DiscordIds = { guildId: string; supporterRoleId: string | null; testerRoleId: string | null };

type DiscordInstance = {
	rest: REST;
	clientId: string;
	clientSecret: string;
	baseUrl: string;
	ids: DiscordIds;
	makeCallbackUrl: () => string;
};

let discordInstance: DiscordInstance | null = null;

export function useDiscord(event: H3Event): DiscordInstance | null {
	if (!discordInstance) {
		const config = useRuntimeConfig(event);
		if (config.discordBotToken && config.discordGuildId && config.discordClientId && config.discordClientSecret) {
			discordInstance = {
				rest: new REST({ version: '10' }).setToken(config.discordBotToken),
				baseUrl: 'https://discord.com/api/v10',
				clientId: config.discordClientId,
				clientSecret: config.discordClientSecret,
				ids: {
					guildId: config.discordGuildId,
					testerRoleId: config.discordTesterRoleId ? config.discordTesterRoleId : null,
					supporterRoleId: config.discordSupporterRoleId ? config.discordSupporterRoleId : null
				},
				makeCallbackUrl() {
					return new URL('/account/connect/discord', config.public.baseUrl).toString();
				}
			};
		}
	}

	return discordInstance;
}

export async function assignDiscordMemberSupporterRole(discord: DiscordInstance, memberId: string, roleId: string | null) {
	if (discord.ids.supporterRoleId) {
		await discord.rest.put(Routes.guildMemberRole(discord.ids.guildId, memberId, discord.ids.supporterRoleId));
	}
	if (roleId) {
		await discord.rest.put(Routes.guildMemberRole(discord.ids.guildId, memberId, roleId));
	}
}

export async function assignDiscordMemberTesterRole(discord: DiscordInstance, memberId: string) {
	if (discord.ids.testerRoleId) {
		await discord.rest.put(Routes.guildMemberRole(discord.ids.guildId, memberId, discord.ids.testerRoleId));
	}
}

export async function removeDiscordMemberSupporterRole(discord: DiscordInstance, memberId: string, roleId: string | null) {
	if (discord.ids.supporterRoleId) {
		await discord.rest.delete(Routes.guildMemberRole(discord.ids.guildId, memberId, discord.ids.supporterRoleId));
	}
	if (roleId) {
		await discord.rest.delete(Routes.guildMemberRole(discord.ids.guildId, memberId, roleId));
	}
}

export async function removeDiscordMemberTesterRole(discord: DiscordInstance, memberId: string) {
	if (discord.ids.testerRoleId) {
		await discord.rest.delete(Routes.guildMemberRole(discord.ids.guildId, memberId, discord.ids.testerRoleId));
	}
}
