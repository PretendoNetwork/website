import { usePapr } from '~~/server/utils/papr';

export default defineEventHandler(async (event): Promise<void> => {
	const auth = enforceLoggedIn(event);
	const papr = await usePapr(event);
	const stripe = useStripe(event);
	if (!stripe || !papr) {
		throw createApiError('INTEGRATION_DISABLED');
	}

	if (!auth.stripeSubscriptionId) {
		return; // No subscription, do nothing
	}

	await stripe.subscriptions.cancel(auth.stripeSubscriptionId);

	let newAccessLevel = 0;
	if (auth.accessLevel >= 2) {
		newAccessLevel = auth.accessLevel; // Staff shouldn't be downgraded on unsubscribe
	}

	await papr.Pnid.updateOne({ pid: auth.pid }, {
		$unset: {
			'connections.stripe.subscription_id': 1,
			'connections.stripe.price_id': 1,
			'connections.stripe.tier_name': 1
		},
		$set: {
			'connections.stripe.tier_level': 0,
			'access_level': newAccessLevel
		}
	});
});
