<script setup lang="ts">
import type { ApiAccountCheckoutRequest } from '~~/shared/api-types';

definePageMeta({
	needsAuth: true
});

const { data: tierData } = await useApiFetch('/api/account/tiers');
const { data: profile } = await useApiFetch('/api/auth/me');
const sortedTiers = computed(() => [...tierData.value?.tiers ?? []].sort((a, b) => a.tierLevel - b.tierLevel));

async function unsubscribe() {
	try {
		await apiFetch('/api/account/unsubscribe', {
			method: 'POST'
		});
		await navigateTo('/account');
	} catch (error: unknown) {
		const err = getApiError(error);
		alert(err.code);
	}
}

async function checkout(priceId: string) {
	try {
		const result = await apiFetch('/api/account/checkout', {
			method: 'POST',
			body: {
				priceId
			} satisfies ApiAccountCheckoutRequest
		});
		await navigateTo(result.url, { external: true });
	} catch (error: unknown) {
		const err = getApiError(error);
		alert(err.code);
	}
}

function hasSubscription(priceId: string) {
	return profile.value?.stripeTier && priceId === profile.value.stripeTier.priceId;
}
</script>

<template>
  <div>
    <h1>Tiers</h1>
    <div
      v-for="tier of sortedTiers"
      :key="tier.priceId"
      :style="{ border: '1px solid white'}"
    >
      <h2>{{ tier.name }}</h2>
      <p>{{ tier.description }}</p>
      <p v-if="tier.perks.beta">
        Perk: Beta access
      </p>
      <p v-if="tier.perks.discordRead">
        Perk: Read discord channels
      </p>
      <img
        v-if="tier.thumbnailUrl"
        :src="tier.thumbnailUrl"
      >
      <p>Cost: {{ tier.priceCents }} cents</p>
      <button
        v-if="hasSubscription(tier.priceId)"
        @click="unsubscribe()"
      >
        Unsubscribe
      </button>
      <button
        v-else
        @click="checkout(tier.priceId)"
      >
        Checkout
      </button>
    </div>
  </div>
</template>
