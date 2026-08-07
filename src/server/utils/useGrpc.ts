import { APIDefinition } from "@pretendonetwork/grpc/api/api_service";
import { createChannel, createClient, Channel, type Client, Metadata } from "nice-grpc";

let grpc: { channel: Channel, client: Client<APIDefinition> } | null = null;

function getGrpcClient(event: H3Event): Client<APIDefinition> {
	if (!grpc) {
		const config = useRuntimeConfig();
		if (!config.grpcHost || !config.grpcApiKey) {
			throw new Error("GRPC not configured");
		}

		const channel = createChannel(config.grpcHost);
		const metadata = new Metadata();
		metadata.append("X-API-Key", config.grpcApiKey);
		grpc = {
			channel,
			client: createClient(APIDefinition, channel, {
				"*": {
					metadata
				}
			})
		}
	}

	return grpc.client;
}

export function useGrpc(event: H3Event) {
	return getGrpcClient(event);
}
