import type { ApiAccountTiers, TierItem } from '~~/shared/api-types';

export default defineEventHandler(async (event): Promise<ApiAccountTiers> => {
	enforceLoggedIn(event);
	const stripe = useStripe(event);
	if (!stripe) {
		throw createApiError('INTEGRATION_DISABLED');
	}

	const prices = await stripe.prices.list().autoPagingToArray({ limit: 10 });
	const products = await stripe.products.list().autoPagingToArray({ limit: 10 });

	const tiers: TierItem[] = [];

	for (const product of products) {
		if (!product.active) {
			continue;
		}
		const price = prices.find(price => price.id === product.default_price);
		if (!price) {
			continue;
		}

		const tierLevel = Number(product.metadata.tier_level ?? '0');
		const hasDiscordReadPerk = product.metadata.discord_read === 'true';
		const hasBetaAccessPerk = product.metadata.beta === 'true';

		tiers.push({
			priceId: price.id,
			tierLevel,
			priceCents: price.unit_amount ?? 0,
			thumbnailUrl: product.images[0] ?? null,
			name: product.name,
			description: product.description,
			perks: {
				discordRead: hasDiscordReadPerk,
				beta: hasBetaAccessPerk
			}
		});
	}

	return {
		tiers
	};
});
