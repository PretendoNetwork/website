import type { RouteLocationNormalizedGeneric } from 'vue-router';

function notAllowed(to: RouteLocationNormalizedGeneric) {
	const authUtils = useAuthUtils();
	return authUtils.redirectToLogin(to.fullPath);
}

export default defineNuxtRouteMiddleware(async (to) => {
	const meStore = useMeStore();
	if (!meStore.loaded) {
		throw new Error('Mestore must be loaded before reaching this middleware');
	}

	if (to.meta.needsAuth) {
		if (!meStore.user) {
			return notAllowed(to);
		}
	}
});
