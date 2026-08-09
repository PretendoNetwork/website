import { usePapr } from '~~/server/utils/papr';
import { CheckoutSchema } from '~~/shared/api-types';
import type { ApiAccountCheckoutLink } from '~~/shared/api-types';

export default defineEventHandler(async (event): Promise<ApiAccountCheckoutLink> => {
	const auth = enforceLoggedIn(event);
	const papr = await usePapr(event);
	const stripe = useStripe(event);
	const config = useRuntimeConfig(event);
	if (!stripe || !papr) {
		throw createError({
			status: 400,
			message: 'Stripe integration not configured'
		});
	}

	const body = await readZodBody(event, CheckoutSchema);
	const { data: searchResults } = await stripe.customers.search({
		query: `metadata['pnid_pid']:'${auth.pid}'`
	});
	let customer = searchResults[0];
	if (!customer) {
		customer = await stripe.customers.create({
			email: auth.email,
			metadata: {
				pnid_pid: auth.pid
			}
		});
	}

	// ensure PNID always has latest customer ID
	if (auth.accessLevel >= 2) {
		throw createError({
			status: 400,
			message: 'Staff members do not need to purchase tiers'
		});
	}
	await papr.Pnid.updateOne({ pid: auth.pid }, {
		$set: {
			'connections.stripe.customer_id': customer.id,
			'connections.stripe.latest_webhook_timestamp': 0
		}
	});

	const priceId = body.priceId;
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		customer: customer.id,
		mode: 'subscription',
		success_url: new URL('/account?upgrade_success=true', config.public.baseUrl).toString(),
		cancel_url: new URL('/account?upgrade_success=false', config.public.baseUrl).toString()
	});
	if (!session.url) {
		throw new Error('Failed to create session');
	}

	return {
		url: session.url
	};
});
