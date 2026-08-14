import { getDiscordUser } from '~~/server/utils/discord';
import type { GetApiAuthMeConections } from '~~/shared/api-types';
import type { DiscordUser } from '~~/server/utils/discord';

export default defineEventHandler(async (event): Promise<GetApiAuthMeConections> => {
	const auth = enforceLoggedIn(event);
	const discord = useDiscord(event);

	const apiGrpc = useApiGrpcWithToken(event, auth.token);
	const data = await apiGrpc.getUserData({});
	let discordUser: DiscordUser | null = null;
	if (data.connections?.discord?.id && discord) {
		discordUser = await getDiscordUser(discord, data.connections.discord.id);
	}

	return {
		pid: data.pid,
		discord: discordUser
			? {
					id: discordUser.id,
					username: discordUser.username,
					discriminator: discordUser.discriminator,
					avatar: discordUser.avatar ?? null,
					avatarUrl: discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : null
				}
			: null
	};
});
