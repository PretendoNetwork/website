import type { Stripe } from 'stripe';

export type StripeDonationResponse = {
	donatorCount: number;
	totalDonationsCents: number;
};

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

const cacheKey = 'stripeDonations';
const cacheMaxAgeMs = 60 * 60 * 1000; // 1 hour

export async function getStripeDonations(cacher: Cacher, stripe: Stripe | null, ignoreCache = false): Promise<StripeDonationResponse> {
	if (!stripe) {
		// No credentials, fill in blank data
		return {
			donatorCount: 0,
			totalDonationsCents: 0
		};
	}

	if (!ignoreCache) {
		const cached = await cacher.get<StripeDonationResponse>(cacheKey);
		if (cached) {
			return cached;
		}
	}

	const data = await getStripeDonationData(stripe);
	await cacher.set(cacheKey, data, cacheMaxAgeMs);
	return data;
}
