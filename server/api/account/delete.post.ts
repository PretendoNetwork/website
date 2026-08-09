export default defineEventHandler(async (event): Promise<void> => {
	const auth = enforceLoggedIn(event);

	const grpc = useApiGrpc(event);
	await grpc.deleteAccount({ pid: auth.pid });
});
