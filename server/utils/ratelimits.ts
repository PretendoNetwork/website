import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import type { RateLimiterAbstract, IRateLimiterOptions } from 'rate-limiter-flexible';
import type { H3Event } from 'h3';

let redisRatelimit: Redis | null = null;

export type RatelimitBucketOptions = {
	id: string;
	points: number;
	durationSec: number;
	blockDurationSec?: number;
};

export function createRatelimitBucket(ops: RatelimitBucketOptions) {
	const config = useRuntimeConfig();
	const prefix = `pn:website:ratelimit:${ops.id}`;
	const ratelimitOps: IRateLimiterOptions = {
		keyPrefix: prefix,
		duration: ops.durationSec,
		blockDuration: ops.blockDurationSec,
		points: ops.points
	};

	if (config.redisUrl) {
		if (!redisRatelimit) {
			redisRatelimit = new Redis(config.redisUrl, {
				enableOfflineQueue: false
			});
		}
		return new RateLimiterRedis({
			...ratelimitOps,
			storeClient: redisRatelimit
		});
	}

	return new RateLimiterMemory(ratelimitOps);
}

export async function enforceRatelimit(event: H3Event, bucket: RateLimiterAbstract): Promise<void> {
	const config = useRuntimeConfig();
	const ip = getRequestIP(event, { xForwardedFor: !!config.trustProxy });
	if (!ip) {
		throw new Error('Could not get IP for request');
	}

	try {
		await bucket.consume(ip, 1);
	} catch {
		throw createApiError('RATELIMITED');
	}
}
