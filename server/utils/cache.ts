import Redis from 'ioredis';
import type { H3Event } from 'h3';

let cacher: Cacher | null = null;

export type Cacher = {
	set<T>(key: string, val: T, cacheAgeMs?: number): Promise<void>;
	get<T>(key: string): Promise<T | null>;
};

function createCacher(event: H3Event): Cacher {
	const config = useRuntimeConfig(event);
	if (config.redisUrl) {
		const redis = new Redis(config.redisUrl);
		const prefix = `pn:website:cache`;
		return {
			async get(key) {
				try {
					const result = await redis.get(`${prefix}:${key}`);
					if (result) {
						return JSON.parse(result);
					}
				} catch {
					// Catch connection & serialisation errors
				}
				return null;
			},
			async set(key, val, cacheAgeMs) {
				try {
					const fullKey = `${prefix}:${key}`;
					await redis.set(fullKey, JSON.stringify(val));
					if (cacheAgeMs) {
						await redis.expire(fullKey, Math.round(cacheAgeMs / 1000));
					}
				} catch {
					// Catch connection & serialisation errors
				}
			}
		};
	}

	// Memory cacher
	const store = new Map<string, { expiresAt: Date | null; value: string }>();
	return {
		async get(key) {
			try {
				const result = store.get(key);
				if (result) {
					if (result.expiresAt && result.expiresAt < new Date()) {
						store.delete(key);
						return null; // Expired
					}
					return JSON.parse(result.value);
				}
			} catch {
				// catch Serialisation errors
			}
			return null;
		},
		async set(key, val, cacheAgeMs) {
			try {
				store.set(key, {
					expiresAt: cacheAgeMs ? new Date(Date.now() + cacheAgeMs) : null,
					value: JSON.stringify(val)
				});
			} catch {
				// Catch serialisation errors
			}
		}
	};
}

export function useCacher(event: H3Event): Cacher {
	if (!cacher) {
		cacher = createCacher(event);
	}

	return cacher;
}
