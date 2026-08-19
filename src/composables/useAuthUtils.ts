export function getSafeRedirectUrl(input: string | null, baseUrl: string, allowedHosts: string[] = []): { url: string; external: boolean } | null {
	const parsedBaseUrl = new URL(baseUrl);
	if (!input) {
		return null; // No or empty input
	}

	let url: URL | null = null;
	try {
		url = new URL(input, parsedBaseUrl);
	} catch {
		return null; // Invalid URL input
	}

	const isAllowedHost = allowedHosts.includes(url.host);
	if (!isAllowedHost) {
		return null; // Not in the allowed hosts
	}

	// If on the same host as the website, only return the path. For internal redirects
	if (url.host === parsedBaseUrl.host) {
		return {
			url: url.pathname + url.search,
			external: false
		};
	}
	return {
		url: url.toString(),
		external: true
	};
}

export function useAuthUtils() {
	const authStore = useAuthStore();
	const config = useRuntimeConfig();
	const allowedRedirectHosts = computed(() => config.public.redirectHosts.split(' ').map(v => v.trim()).filter(v => v.length > 0));

	return {
		async safelyRedirectAfterLogin(inputUrl: string | null) {
			const redirectUrl = getSafeRedirectUrl(inputUrl, config.public.baseUrl, allowedRedirectHosts.value);
			if (!redirectUrl) {
				await navigateTo('/account');
				return;
			}
			await navigateTo(redirectUrl.url, {
				external: redirectUrl.external
			});
		},
		redirectToLogin(to?: string | undefined) {
			const target = to ?? useRoute().fullPath;
			return navigateTo({
				path: '/account/login',
				query: {
					redirect: target
				}
			});
		},
		async logout() {
			authStore.logout();
			await navigateTo('/'); // Back to homepage
		}
	};
}
