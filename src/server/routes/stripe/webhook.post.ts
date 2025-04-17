import { handleStripeEvent } from '~/server/utils/stripe-event';
import { getStripeClient } from '../../utils/stripe';
import type Stripe from 'stripe';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const stripe = getStripeClient(event);
	if (!stripe || !config.stripeWebhookKey) {
		throw createError({
			statusCode: 403
		});
	}

	const rawBody = await readRawBody(event) ?? '';
	const signature = getHeader(event, 'Stripe-Signature') ?? '';
	let stripeEvent: Stripe.Event | null = null;
	try {
		stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, config.stripeWebhookKey);
	} catch (err) {
		console.error('Failed to validate webhook', err);
		throw createError({
			statusCode: 400,
			message: 'Failed to validate webhook'
		});
	}

	await handleStripeEvent(stripeEvent, stripe);

	return 'success';
});
