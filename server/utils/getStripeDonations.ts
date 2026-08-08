import Stripe from "stripe";

export type StripeDonationResponse = {
	donatorCount: number;
	totalDonationsCents: number;
}

const cacheMaxAgeMs = 60 * 60 * 1000; // 1 hour
let cache: { response: StripeDonationResponse, createdAt: Date } | null = null;

async function getStripeDonationData(stripe: Stripe): Promise<StripeDonationResponse> {
	const donationData: StripeDonationResponse = {
		donatorCount: 0,
		totalDonationsCents: 0,
	};

	let hasMore: boolean;
	let lastId: string | null = null;

	do {
		const { data: activeSubscriptions, has_more } = await stripe.subscriptions.list({
			limit: 100,
			status: 'active',
			starting_after: lastId ?? undefined,
		});


		for (const subscription of activeSubscriptions) {
			const plan = subscription.items.data[0]?.plan;
			if (!plan) continue;
			donationData.donatorCount += 1;
			donationData.totalDonationsCents += plan?.amount ?? 0;
			lastId = subscription.id;
		}

		hasMore = has_more;
	} while (hasMore);

	return donationData;
}


export async function getStripeDonations(stripe: Stripe | null, ignoreCache = false): Promise<StripeDonationResponse> {
	if (!cache || new Date(cache.createdAt.getTime() + cacheMaxAgeMs) < new Date() || ignoreCache) {
		// No credentials, fill in blank data
		if (!stripe) {
			return {
				donatorCount: 0,
				totalDonationsCents: 0,
			}
		}

		cache = {
			createdAt: new Date(),
			response: await getStripeDonationData(stripe)
		};
	}

	return cache.response;
}
