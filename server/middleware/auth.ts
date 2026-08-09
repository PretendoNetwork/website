export default defineEventHandler(async (event) => {
	const authHeader = getRequestHeader(event, 'authorization');
	setAuthContext(event, null)
	if (authHeader) {
		try {
			const [type, token] = authHeader.split(' ', 2);
			if (type !== 'Bearer') {
				throw new Error('Invalid token type');
			}
			if (!token) {
				throw new Error('Invalid token');
			}
			const grpc = useLegacyApiGrpcWithToken(event, token);
			const userData = await grpc.getUserData({});

			setAuthContext(event, {
				pid: userData.pid,
				username: userData.username,
				token: token,
			})
		} catch (err) {
			console.error('Failed to request user data: ', err);
			return; // Continue like nothing happened, further steps will validate if authed
		}
	}
});
