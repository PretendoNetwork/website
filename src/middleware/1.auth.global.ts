import type { GetApiAuthMe } from "~/server/api/auth/me.get";

export default defineNuxtRouteMiddleware(async () => {
	const meStore = useMeStore();
	if (meStore.loaded) return; // Already loaded

	const authStore = useAuthStore();
	const token = authStore.getToken();
	if (!token) {
		meStore.setMe(null);
		return; // No token
	}

	try {
		const res = await $fetch<GetApiAuthMe>('/api/auth/me', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		meStore.setMe({
			pid: res.pid,
			username: res.username,
		});
	} catch {
		meStore.setMe(null);
	}
});
