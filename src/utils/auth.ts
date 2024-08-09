import { cookies } from 'next/headers';

function isLoggedIn() {
	const cs = cookies();
	const isLoggedIn = cs.has('access_token') && cs.has('refresh_token') && cs.has('token_type');
	return isLoggedIn;
}

export { isLoggedIn };
