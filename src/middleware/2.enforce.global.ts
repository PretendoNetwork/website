function notAllowed() {
	return navigateTo('/');
}

export default defineNuxtRouteMiddleware(async (to) => {
	const meStore = useMeStore();
	if (!meStore.loaded) {
		throw new Error('Mestore must be loaded before reaching this middleware');
	}

	if (to.meta.needsAuth) {
		if (!meStore.user) {
			return notAllowed();
		}
	}
});
