import Stripe from 'stripe';
import type { H3Event } from 'h3';

let stripeClient: Stripe | null = null;

export function getStripeClient(event: H3Event): Stripe | null {
	if (stripeClient) {
		return stripeClient;
	}

	const config = useRuntimeConfig(event);
	if (!config.stripeSecretKey) {
		return null;
	}
	stripeClient = new Stripe(config.stripeSecretKey);

	return stripeClient;
}
