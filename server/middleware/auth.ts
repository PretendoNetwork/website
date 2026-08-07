import { Metadata } from "nice-grpc";
import { useGrpc } from "../utils/useGrpc";

export default defineEventHandler(async (event) => {
	const authHeader = getRequestHeader(event, "authorization");
	event.context.auth = null;
	if (authHeader) {
		const grpc = useGrpc(event);
		try {
			const [type, token] = authHeader.split(" ", 2);
			if (type !== "Bearer") throw new Error("Invalid token type");
			if (!token) throw new Error("Invalid token");
			const userData = await grpc.getUserData({}, {
				metadata: new Metadata({
					'X-Token': token
				})
			});

			event.context.auth = {
				pid: userData.pid,
				username: userData.username,
			}
		} catch (err) {
			console.error("Failed to request user data: ", err);
			return; // Continue like nothing happened, further steps will validate if authed
		}
	}
})
