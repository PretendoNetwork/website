import type { GetApiAuthMe } from '#shared/api-types';

export default defineNuxtRouteMiddleware(async () => {
	const meStore = useMeStore();
	if (meStore.loaded) {
		return;
	} // Already loaded

	const authStore = useAuthStore();
	authStore.refresh();
	const tokens = authStore.getTokens();
	if (!tokens) {
		meStore.setMe(null);
		return; // No token
	}

	try {
		const res = await $fetch<GetApiAuthMe>('/api/auth/me', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		meStore.setMe({
			pid: res.pid,
			username: res.username,
			mii: res.mii
		});
	} catch {
		meStore.setMe(null);
	}
});
