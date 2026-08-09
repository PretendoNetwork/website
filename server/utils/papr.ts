import { MongoClient } from "mongodb";
import Papr, { schema, types } from "papr"
import type { H3Event } from 'h3'

const papr = new Papr();
let conn: MongoClient | null = null;

const pnidSchema = schema({
	pid: types.number({ required: true }),
	username: types.string({ required: true }),
	access_level: types.number({ required: true }),
	server_access_level: types.enum(['prod', 'test', 'dev'] as const, { required: true }),
	connections: types.object({
		stripe: types.object({
			customer_id: types.string(),
			subscription_id: types.string(),
			price_id: types.string(),
			tier_level: types.number(),
			tier_name: types.string(),
			latest_webhook_timestamp: types.number(),
		}),
		discord: types.object({
			id: types.string(),
		})
	})
});
const Pnid = papr.model('pnids', pnidSchema);
export type PnidDocument = (typeof pnidSchema)[0];

const paprInstance = {
	papr,
	Pnid,
} as const;

export type PaprInstance = typeof paprInstance;

export async function usePapr(event: H3Event): Promise<PaprInstance | null> {
	if (!conn) {
		const config = useRuntimeConfig(event);
		if (config.mongoConnectionString) {
			conn = await MongoClient.connect(config.mongoConnectionString);
			papr.initialize(conn.db());
		}
	}

	return conn ? paprInstance : null;
}
