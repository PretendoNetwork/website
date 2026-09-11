import { createHmac } from 'node:crypto';
import type { GetUserDataResponse } from '@pretendonetwork/grpc/api/v2/get_user_data_rpc';

export function getDicourseSignature(secret: string, payload: string) {
	return createHmac('sha256', secret).update(payload).digest('hex');
}

export async function createDiscoursePayload(nonce: string, accountData: GetUserDataResponse): Promise<string> {
	const groups = config.discourse.groups;
	const managedGroups = Object.values(groups).flatMap(category => Object.values(category));
	const addGroups = [];

	// * If more than one of the provided groups in add_groups are configured to
	// * be automatically set as the primary group, Discourse unfortunately
	// * appears to set the user's primary group arbitrarily and
	// * non-deterministically. However, it also ignores groups that the user
	// * was already in before this sign-in, so the primary group won't change
	// * if none of the user's group memberships change.
	if (accountData.connections.discord?.id) {
		for (const role in groups.discord_role) {
			if (await discordMemberHasRole(accountData.connections.discord.id, role)) {
				addGroups.push(groups.discord_role[role]);
			}
		}
	}

	if (accountData.connections.stripe?.tier_level) {
		for (const tier in groups.stripe_tier) {
			if (accountData.connections.stripe.tier_level.toString() === tier) {
				addGroups.push(groups.stripe_tier[tier]);
			}
		}
	}

	for (const level in groups.access_level) {
		if (accountData.access_level.toString() === level) {
			addGroups.push(groups.access_level[level]);
		}
	}

	const removeGroups = managedGroups.filter(group => !addGroups.includes(group));

	// Discourse SSO Payload
	// https://meta.discourse.org/t/official-single-sign-on-for-discourse-sso/13045
	const payload = new URLSearchParams({
		nonce: nonce,
		external_id: accountData.pid.toString(),
		email: `${accountData.pid}@invalid.com`, // Don't change, used by other systems
		username: accountData.username,
		name: accountData.mii.name,
		avatar_url: `${config.public.cdnBaseUrl}/mii/${accountData.pid}/normal_face.png`,
		avatar_force_update: 'true',
		add_groups: addGroups.join(','),
		remove_groups: removeGroups.join(',')
	});

	return Buffer.from(payload.toString()).toString('base64');
}

export async function discourseUserExists(pid: number) {
	const response = await $fetch.raw(`/users/by-external/${pid}.json`, {
		baseURL: config.discourse.api.base_url,
		ignoreResponseError: true,
		headers: {
			'Api-Username': config.discourse.api.username,
			'Api-Key': config.discourse.api.key
		}
	});
	if (response.status === 200) {
		return true;
	} else if (response.status === 404) {
		return false;
	} else {
		throw new Error(`Discourse API error while checking if user ${pid} exists: ${response.status} - ${JSON.stringify(response._data)}`);
	}
}

export async function syncDiscourseSso(pnid: GetUserDataResponse) {
	const payload = await createDiscoursePayload('', pnid);
	const body = new FormData();
	body.set('sso', payload);
	body.set('sig', getDicourseSignature(secret, payload));

	// Documentation: https://meta.discourse.org/t/sync-discourseconnect-user-data-with-the-sync-sso-route/84398
	await fetch(`/admin/users/sync_sso`, {
		baseUrl: config.discourse.api.base_url,
		body,
		headers: {
			'Api-Username': config.discourse.api.username,
			'Api-Key': config.discourse.api.key
		}
	});
}
