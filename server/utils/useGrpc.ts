import { createChannel, createClient, Metadata } from 'nice-grpc';
import { ApiServiceDefinition } from '@pretendonetwork/grpc/api/v2/api_service';
import { APIDefinition } from '@pretendonetwork/grpc/api/api_service';
import { AccountServiceDefinition } from '@pretendonetwork/grpc/account/v2/account_service';
import type { Channel, Client, CompatServiceDefinition } from 'nice-grpc';
import type { H3Event } from 'h3'

let grpc: { channel: Channel } | null = null;

function getGrpcClient<T extends CompatServiceDefinition>(event: H3Event, def: T, token?: string): Client<T> {
	const config = useRuntimeConfig(event);

	if (!grpc) {
		if (!config.grpcHost) {
			throw new Error('GRPC not configured');
		}

		grpc = {
			channel: createChannel(config.grpcHost)
		};
	}

	const metadata = new Metadata();
	if (config.grpcApiKey) {
		metadata.append('X-API-Key', config.grpcApiKey);
	}
	if (token) {
		metadata.append('X-Token', token);
	}

	const client = createClient(def, grpc.channel, {
		'*': {
			metadata
		}
	});

	return client;
}

export function useApiGrpc(event: H3Event): Client<ApiServiceDefinition> {
	return getGrpcClient(event, ApiServiceDefinition);
}

export function useLegacyApiGrpc(event: H3Event): Client<APIDefinition> {
	return getGrpcClient(event, APIDefinition);
}

export function useAccountGrpc(event: H3Event): Client<AccountServiceDefinition> {
	return getGrpcClient(event, AccountServiceDefinition);
}

export function useLegacyApiGrpcWithToken(event: H3Event, token: string): Client<APIDefinition> {
	return getGrpcClient(event, APIDefinition, token);
}

export function useApiGrpcWithToken(event: H3Event, token: string): Client<APIDefinition> {
	return getGrpcClient(event, APIDefinition, token);
}
