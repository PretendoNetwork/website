import { FetchError } from 'ofetch';
import type { ApiAuthRefreshRequest } from '~~/shared/api-types';

export function useLogin() {
	const authStore = useAuthStore();
	const meStore = useMeStore();

	async function handleRefresh(): Promise<{ hasNewTokens: boolean }> {
		if (meStore.user) {
			return { hasNewTokens: false }; // You're good, nothing to do
		}

		const tokens = authStore.getTokens();
		if (!tokens || !tokens.refreshToken) {
			return { hasNewTokens: false }; // No tokens to use
		}

		try {
			const result = await $fetch('/api/auth/refresh', {
				method: 'POST',
				body: {
					token: tokens?.refreshToken ?? ''
				} satisfies ApiAuthRefreshRequest
			});
			authStore.set({
				accessToken: result.accessToken,
				refreshToken: result.refreshToken
			});
			return { hasNewTokens: true };
		} catch (err) {
			if (err instanceof FetchError) {
				if (err.statusCode === 401) {
					// Refresh token expired, log out
					authStore.logout();
				}
			}
			return { hasNewTokens: false };
		}
	}

	function isLoggedIn() {
		if (meStore.user) {
			return true;
		}
		return false;
	}

	function canRefresh() {
		const tokens = authStore.getTokens();
		if (!tokens || !tokens.refreshToken) {
			return false; // No refresh token to use
		}
		return true;
	}

	return {
		handleRefresh,
		canRefresh,
		isLoggedIn
	};
}
