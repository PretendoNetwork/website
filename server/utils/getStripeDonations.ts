import type { Stripe } from 'stripe';

export type StripeDonationResponse = {
	donatorCount: number;
	totalDonationsCents: number;
};

const cacheMaxAgeMs = 60 * 60 * 1000; // 1 hour
let cache: { response: StripeDonationResponse; createdAt: Date } | null = null;

async function getStripeDonationData(stripe: Stripe): Promise<StripeDonationResponse> {
	const donationData: StripeDonationResponse = {
		donatorCount: 0,
		totalDonationsCents: 0
	};

	await stripe.subscriptions.list({
		limit: 100,
		status: 'active'
	}).autoPagingEach((sub) => {
		const plan = sub.items.data[0]?.plan;
		if (!plan) {
			return;
		}
		donationData.donatorCount += 1;
		donationData.totalDonationsCents += plan?.amount ?? 0;
	});

	return donationData;
}

export async function getStripeDonations(stripe: Stripe | null, ignoreCache = false): Promise<StripeDonationResponse> {
	if (!cache || new Date(cache.createdAt.getTime() + cacheMaxAgeMs) < new Date() || ignoreCache) {
		// No credentials, fill in blank data
		if (!stripe) {
			return {
				donatorCount: 0,
				totalDonationsCents: 0
			};
		}

		cache = {
			createdAt: new Date(),
			response: await getStripeDonationData(stripe)
		};
	}

	return cache.response;
}
