export default defineEventHandler(async (event): Promise<void> => {
	const auth = enforceLoggedIn(event);
	const discord = useDiscord(event);
	if (!discord) throw createError({
		status: 400,
		message: 'Discord integration not configured',
	})

	const grpc = useApiGrpcWithToken(event, auth.token);
	await grpc.setDiscordConnectionData({
		id: '',
	});

	// TODO set roles based on stripe info
});
