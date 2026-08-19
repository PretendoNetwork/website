import { Stripe } from 'stripe';
import type { H3Event } from 'h3';

let stripe: Stripe | null = null;

export function useStripe(event: H3Event): Stripe | null {
	if (!stripe) {
		const config = useRuntimeConfig(event);
		if (config.stripeSecretKey) {
			stripe = new Stripe(config.stripeSecretKey);
		}
	}
	return stripe;
}
