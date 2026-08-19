/* eslint-disable no-self-assign -- Self assign is needed for refresh cookies */
import type { CookieOptions } from '#app';

type AuthState = {
	accessToken: string;
	refreshToken: string;
};

// Cookies on pretendo are weird:
// `pretendo::auth` has the real authentication state that the website uses.
// This has been made as secure as possible and must only be used in the website codebase.
//
// Then we have the rest of the cookies:
// - `access_token`
// - `refresh_token`
// - `token_type`
// These are for backwards compatibility. They must be configured exactly as implemented below
// because other services use them (and overwrite them)
// These are not used by the website codebase for security purposes.

const oldCookieTokenType = 'Bearer';
const cookieExpirySec = 7 * 24 * 60 * 60; // 7 days
const oldCookieOptions = (url: string) => ({
	domain: `.${new URL(url).hostname}`,
	secure: false,
	httpOnly: false,
	maxAge: cookieExpirySec,
	sameSite: 'lax',
	refresh: true,
	readonly: false
} satisfies CookieOptions<string> & { readonly: false });

// Not actually a store, but may as well be
export function useAuthStore() {
	const config = useRuntimeConfig().public;
	const authState = useCookie<AuthState | null>('pretendo::auth', {
		sameSite: 'lax',
		secure: config.cookieSecure,
		maxAge: cookieExpirySec,
		refresh: true,
		default: () => null
	});
	const oldOpts = oldCookieOptions(config.baseUrl);
	const accessTokenCookie = useCookie<string | null>('access_token', oldOpts);
	const refreshTokenCookie = useCookie<string | null>('refresh_token', oldOpts);
	const tokenTypeCookie = useCookie<string | null>('token_type', oldOpts);

	function getTokens() {
		if (!authState.value) {
			return null;
		}

		return {
			accessToken: authState.value.accessToken,
			refreshToken: authState.value.refreshToken
		};
	}

	function refresh() {
		authState.value = authState.value;
		accessTokenCookie.value = accessTokenCookie.value;
		refreshTokenCookie.value = refreshTokenCookie.value;
		tokenTypeCookie.value = tokenTypeCookie.value;
	}

	function set(val: AuthState | null) {
		if (val) {
			authState.value = val;
			accessTokenCookie.value = val.accessToken;
			refreshTokenCookie.value = val.refreshToken;
			tokenTypeCookie.value = oldCookieTokenType;
		} else {
			authState.value = null;
			accessTokenCookie.value = null;
			refreshTokenCookie.value = null;
			tokenTypeCookie.value = null;
		}
		useMeStore().clear();
	}

	function logout() {
		set(null);
	}

	return {
		getTokens,
		refresh,
		set,
		logout
	};
}
