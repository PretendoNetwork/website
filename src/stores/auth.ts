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
const oldCookieOptions = {
	domain: '.pretendo.network',
	secure: false,
	httpOnly: false,
	maxAge: cookieExpirySec,
	refresh: true,
	readonly: false
} satisfies CookieOptions<string> & { readonly: false };

// Not actually a store, but may as well be
export function useAuthStore() {
	const authState = useCookie<AuthState | null>('pretendo::auth', {
		sameSite: 'strict',
		secure: useRuntimeConfig().public.cookieSecure,
		refresh: true,
		default: () => null
	});
	const accessTokenCookie = useCookie<string | null>('access_token', oldCookieOptions);
	const refreshTokenCookie = useCookie<string | null>('refresh_token', oldCookieOptions);
	const tokenTypeCookie = useCookie<string | null>('token_type', oldCookieOptions);

	function getToken() {
		return authState.value?.accessToken ?? null;
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
		getToken,
		refresh,
		set,
		logout
	};
}
