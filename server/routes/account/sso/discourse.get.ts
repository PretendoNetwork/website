import { createHmac } from 'node:crypto';
import type { GetUserDataResponse } from '@pretendonetwork/grpc/api/get_user_data_rpc';

function getDicourseSignature(secret: string, payload: string) {
	return createHmac('sha256', secret).update(payload).digest('hex');
}

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const secret = config.discourseSsoSecret;
	if (!secret) {
		return sendRedirect(event, '/');
	}

	const query = getQuery(event);
	const accessTokenCookie = getCookie(event, 'access_token');
	if (!query.sso) {
		return sendRedirect(event, '/');
	}

	const signature = getDicourseSignature(secret, query.sso.toString());
	if (!query.sig || signature !== query.sig) {
		return sendRedirect(event, '/');
	}

	const payload = new URLSearchParams(Buffer.from(query.sso.toString(), 'base64').toString());
	const nonce = payload.get('nonce');
	const returnSsoUrl = payload.get('return_sso_url');
	if (!nonce || !returnSsoUrl) {
		return sendRedirect(event, '/');
	}

	let userData: GetUserDataResponse | null = null;
	if (accessTokenCookie) {
		const grpc = useApiGrpcWithToken(event, accessTokenCookie);
		userData = await grpc.getUserData({});
	}
	if (!userData) {
		const redirectUrlParams = new URLSearchParams();
		redirectUrlParams.append('sso', query.sso.toString());
		redirectUrlParams.append('sig', query.sig.toString());
		const redirect = `/sso/discourse?${redirectUrlParams}`;

		const urlParams = new URLSearchParams();
		urlParams.append('redirect', redirect);
		return sendRedirect(event, `/login?${urlParams}`); // Not logged in, redirect to login
	}

	// Build final payload for discourse
	const returnPayload = new URLSearchParams({
		nonce: nonce,
		external_id: userData.pid.toString(),
		email: `${userData.pid}@invalid.com`, // Don't change, used by other systems
		username: userData.username,
		name: userData.username,
		avatar_url: `${config.public.cdnBaseUrl}/mii/${userData.pid}/normal_face.png`,
		avatar_force_update: 'true'
	});
	const encodedReturnPayload = Buffer.from(returnPayload.toString()).toString('base64');

	const url = new URL(returnSsoUrl);
	url.searchParams.append('sso', encodedReturnPayload);
	url.searchParams.append('sig', getDicourseSignature(secret, encodedReturnPayload));
	return sendRedirect(event, url.toString());
});
