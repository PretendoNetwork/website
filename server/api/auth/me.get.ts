export interface GetApiAuthMe {
	pid: number;
	username: string;
}

export default defineEventHandler(async (event): Promise<GetApiAuthMe> => {
	const auth = enforceLoggedIn(event);

	const grpc = useGrpc(event);
	const data = await grpc.getUserData({ pid: auth.pid });
	return {
		pid: data.pid,
		username: data.username,
	}
});
