import { Stripe } from "stripe";

export default defineEventHandler(async (event): Promise<{ success: boolean, message?: string }> => {
	const config = useRuntimeConfig(event);
	const stripe = useStripe(event);
	if (!stripe || !config.stripeWebhookSecret) throw new Error('Stripe not configured on this instance');

	let webhookEvent: Stripe.Event;
	try {
		const signatureHeader = getHeader(event, 'stripe-signature');
		if (!signatureHeader) throw new Error('No signature header on webhook event');
		const rawBody = await readRawBody(event) ?? '';
		if (!rawBody) throw new Error('No body on webhook event');
		webhookEvent = stripe.webhooks.constructEvent(rawBody, signatureHeader, config.stripeWebhookSecret);
	} catch (error) {
		console.error(error);
		setResponseStatus(event, 400);
		return {
			success: false,
			message: 'Invalid webhook',
		}
	}

	await handleStripeEvent(stripe, webhookEvent);

	return {
		success: true,
	}
});
