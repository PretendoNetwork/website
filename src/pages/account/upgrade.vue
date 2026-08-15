<script setup lang="ts">
/* eslint-disable vue/no-v-html -- locale files still have raw html */
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogRoot,
	AlertDialogTitle,
	AlertDialogTrigger
} from 'reka-ui';
import type { ApiAccountCheckoutRequest, TierItem } from '~~/shared/api-types';

definePageMeta({
	needsAuth: true
});

const { data: tierData } = await useApiFetch('/api/account/tiers');
const { data: profile } = await useApiFetch('/api/auth/me');
const sortedTiers = computed(() =>
	[...(tierData.value?.tiers ?? [])].sort((a, b) => a.tierLevel - b.tierLevel)
);

const selectedTierPriceId = ref<null | string>(profile.value?.stripeTier?.priceId ?? null);
const selectedTier = computed<TierItem | null>(() => selectedTierPriceId.value ? sortedTiers.value.find(v => v.priceId === selectedTierPriceId.value) ?? null : null);
const modalIsOpen = ref(false);

const dialogContainer = useTemplateRef('dialogContainer');

const progress = await useFetch('/api/progress');
const donations = computed(() => progress.data.value?.donations);
const goalPercentage = computed(() => Math.floor((donations.value?.currentCents ?? 0) / (donations.value?.goalCents ?? 0) * 100));

const goalTextVars = computed(() => {
	return {
		totd: Math.round((donations.value?.currentCents ?? 0) / 100).toString(),
		goald: Math.round((donations.value?.goalCents ?? 0) / 100).toString(),
		perc: goalPercentage.value.toString()
	};
});

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
	return (
		profile.value?.stripeTier && priceId === profile.value.stripeTier.priceId
	);
}

useHead({
	title: `Upgrade`
});
</script>

<template>
  <div class="account-form-wrapper">
    <a
      href="/account"
      class="back-arrow"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-arrow-left"
      >
        <line
          x1="19"
          y1="12"
          x2="5"
          y2="12"
        />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span>{{ $t("upgrade.back") }}</span>
    </a>

    <a
      class="logotype"
      href="/"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="39.876"
      >
        <g
          id="logo_type"
          data-name="logo type"
          transform="translate(-553 -467)"
        >
          <g
            id="logo"
            transform="translate(553 467)"
          >
            <rect
              id="XMLID_158_"
              width="39.876"
              height="39.876"
              fill="#9d6ff3"
              opacity="0"
            />
            <g
              id="XMLID_6_"
              transform="translate(8.222 1.418)"
            >
              <path
                id="XMLID_15_"
                d="M69.149,28.312c-1.051.553-.129,2.139.922,1.585a12.365,12.365,0,0,1,8.794-.571,10.829,10.829,0,0,1,6.342,4.166c.645,1,2.231.074,1.585-.922C83.308,27.169,74.7,25.436,69.149,28.312Z"
                transform="translate(-64.246 -23.389)"
                fill="#9d6ff3"
              />
              <path
                id="XMLID_14_"
                d="M82.64,14.608A15.565,15.565,0,0,0,73.5,8.45a17.535,17.535,0,0,0-12.647.9c-1.051.553-.129,2.139.922,1.585,3.411-1.788,7.6-1.714,11.209-.719,3.1.848,6.268,2.544,8.038,5.309C81.681,16.543,83.267,15.622,82.64,14.608Z"
                transform="translate(-57.476 -7.693)"
                fill="#9d6ff3"
              />
              <path
                id="XMLID_9_"
                d="M55.68,47.8a10.719,10.719,0,0,0-6.71,2.3H45.983A1.336,1.336,0,0,0,44.6,51.376V75.84a1.431,1.431,0,0,0,1.383,1.383h3.023a1.367,1.367,0,0,0,1.309-1.383V68.392A10.993,10.993,0,1,0,55.68,47.8Zm0,17.182a6.213,6.213,0,1,1,6.213-6.213A6.216,6.216,0,0,1,55.68,64.982Z"
                transform="translate(-44.6 -40.406)"
                fill="#9d6ff3"
              />
            </g>
          </g>
          <text
            id="Pretendo"
            transform="translate(593 492)"
            fill="#fff"
            font-size="17"
            font-family="Poppins-Bold, Poppins"
            font-weight="700"
          >
            <tspan
              x="0"
              y="0"
            >Pretendo</tspan>
          </text>
        </g>
      </svg>
    </a>

    <h1 class="title dot">
      {{ $t("upgrade.title") }}
    </h1>
    <p class="caption">
      {{ $t("upgrade.description") }}
    </p>

    <div class="progress-bar-wrapper">
      <div
        class="progress-bar"
        :style="{
          '--progress-bar-width': goalPercentage + '%',
        }"
      >
        <div
          v-if="goalPercentage >= 100"
          class="progress-bar-real"
        />
        <div class="progress-bar-capped" />
      </div>
      <span
        class="localeReplace"
      >
        <i18n-t keypath="donation.progress">
          <template #totd>
            <span>${{ goalTextVars.totd }}</span>
          </template>
          <template #goald>
            <span>${{ goalTextVars.goald }}</span>
          </template>
          <template #perc>
            <span>{{ goalTextVars.perc }}%</span>
          </template>
        </i18n-t>
      </span>
    </div>

    <form method="post">
      <template
        v-for="tier of sortedTiers"
        :key="tier.priceId"
      >
        <input
          :id="tier.priceId"
          v-model="selectedTierPriceId"
          type="radio"
          class="tier-radio"
          :data-tier-name="tier.name"
          :value="tier.priceId"
        >
        <label
          class="tier"
          :for="tier.priceId"
        >
          <div class="tier-thumbnail">
            <img
              :src="tier.thumbnailUrl ?? undefined"
              width="100%"
              height="auto"
              alt="Tier icon"
            >
          </div>
          <div class="tier-text">
            <p class="tier-name">{{ tier.name }}</p>
            <div class="tier-perks">
              <p v-if="tier.perks.beta">
                <Icon
                  name="ph:flask"
                  size="20"
                  style="color: var(--green-shade-1)"
                />
                Beta server access
              </p>
              <p v-if="tier.perks.discordRead">
                <Icon
                  name="ph:chats"
                  size="20"
                  style="color: var(--accent-shade-2)"
                />
                Read-only access to select dev channels on Discord
              </p>
            </div>
          </div>
          <p class="price">
            <span>${{ tier.priceCents / 100 }}</span> /
            {{ $t("upgrade.month") }}
          </p>
        </label>
      </template>
      <div
        v-if="selectedTierPriceId && hasSubscription(selectedTierPriceId)"
        class="button-wrapper"
      >
        <AlertDialogRoot v-model:open="modalIsOpen">
          <AlertDialogTrigger>
            {{ $t("upgrade.unsub") }}
          </AlertDialogTrigger>
          <AlertDialogPortal :to="dialogContainer ?? undefined">
            <AlertDialogOverlay />
            <AlertDialogContent class="modal">
              <AlertDialogTitle>{{ $t("upgrade.unsub") }}?</AlertDialogTitle>
              <AlertDialogDescription class="modal-caption">
                <span v-html="$t('upgrade.unsubPrompt').replace('tiername', profile?.stripeTier?.tierName ?? '')" />
              </AlertDialogDescription>
              <div class="modal-button-wrapper">
                <AlertDialogCancel class="cancel">
                  {{ $t("modals.cancel") }}
                </AlertDialogCancel>
                <AlertDialogAction
                  class="alert"
                  @click="unsubscribe"
                >
                  {{ $t("upgrade.unsubConfirm") }}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialogRoot>
      </div>
      <div
        v-else-if="profile?.stripeTier"
        class="button-wrapper"
      >
        <AlertDialogRoot v-model:open="modalIsOpen">
          <AlertDialogTrigger>
            {{ $t("upgrade.changeTier") }}
          </AlertDialogTrigger>
          <AlertDialogPortal :to="dialogContainer ?? undefined">
            <AlertDialogOverlay />
            <AlertDialogContent class="modal">
              <AlertDialogTitle>{{ $t("upgrade.changeTier") }}?</AlertDialogTitle>
              <AlertDialogDescription class="modal-caption">
                <span v-html="$t('upgrade.changeTierPrompt').replace('oldtiername', profile.stripeTier.tierName).replace('newtiername', selectedTier?.name ?? '')" />
              </AlertDialogDescription>
              <div class="modal-button-wrapper">
                <AlertDialogCancel class="cancel">
                  {{ $t("modals.cancel") }}
                </AlertDialogCancel>
                <AlertDialogAction
                  class="action"
                  @click="() => checkout(selectedTier?.priceId || '')"
                >
                  {{ $t("modals.confirm") }}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialogRoot>
      </div>

      <div
        v-else-if="selectedTier?.priceId"
        class="button-wrapper"
      >
        <button

          @click.prevent="checkout(selectedTier.priceId)"
        >
          Subscribe to {{ selectedTier.name }}
        </button>
      </div>
      <div
        v-else
        class="button-wrapper"
      >
        <button
          disabled
        >
          {{ $t('upgrade.tierSelectPrompt') }}
        </button>
      </div>
    </form>
    <div
      id="unsub"
      :class="{ 'modal-wrapper': true, hidden: !modalIsOpen }"
    >
      <div ref="dialogContainer" />
    </div>
  </div>
</template>

<style scoped>
.back-arrow {
	position: relative;
	display: flex;
	justify-content: center;
	top: 48px;
	left: 0;
	width: fit-content;
	padding: 6px 10px;
	background: var(--bg-shade-3);
	border-radius: 24px;

	transition: filter 150ms;
	text-decoration: none;
	color: var(--text-shade-3);
	z-index: 5;
}
.back-arrow:hover {
	filter: brightness(1.5);
}
.back-arrow svg {
	width: 24px;
	height: 24px;
}
.back-arrow span {
	margin: 0 4px;
}

.account-form-wrapper {
	display: flex;
	flex-flow: column;
	width: min(1200px, 100%);
	color: var(--text-shade-1);
	margin: 0 auto 48px;
	text-align: center;
	z-index: 1;
}

.account-form-wrapper .logotype {
	margin: 36px auto 0;
	width: fit-content;
}

h1.title {
	color: var(--text-shade-3);
}
p.caption {
	width: min(100%, 500px);
	margin: 0 auto 36px;
}

.account-form-wrapper .progress-bar-wrapper {
	justify-content: center;
	width: min(100%, 500px);
	margin: 0 auto 72px;
	padding: 24px;
	border-radius: 6px;
	background: var(--bg-shade-2);
	box-sizing: border-box;
}
.account-form-wrapper .progress-bar-wrapper p {
	text-align: left;
	margin-bottom: 0;
}
.account-form-wrapper .progress-bar-wrapper p span {
	color: var(--text-shade-3);
	font-weight: 600;
}

.account-form-wrapper .progress-bar {
	height: 8px;
	border-radius: 4px;
	margin-top: 0;
}

form {
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1.3rem;
}

form .tier-radio {
	display: none;
}
form .tier-radio:checked + label::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-shadow: inset 0 0 0 4px var(--accent-shade-1);
	border-radius: 10px;
}
form .tier-radio:checked + label::after {
	content: url(/assets/images/check.svg);
	display: flex;
	justify-content: center;
	background: var(--accent-shade-1);
	width: 24px;
	height: 24px;
	border-radius: 100%;
	position: absolute;
	top: -16px;
	right: -16px;
	padding: 6px;
}

label.tier {
	display: flex;
	flex-flow: column;
	position: relative;
	border-radius: 10px;
	align-items: center;
	padding-top: calc(50px + 1rem);
	background: var(--bg-shade-3);
	cursor: pointer;
	transition: all 150ms;
	margin-top: 50px;
	text-align: center;
}

label.tier p {
	margin: 0;
	margin-bottom: 0.5rem;
}

label.tier .tier-thumbnail {
	height: 100px;
	width: 100px;
	display: flex;
	align-items: center;
	overflow: hidden;
	border-radius: 8px;
	position: absolute;
	top: -50px;
	z-index: 2;
	background: var(--bg-shade-4);
	padding: 8px;
	box-sizing: border-box;
}
form .tier-radio:checked + label .tier-thumbnail::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-shadow: inset 0 0 0 4px var(--accent-shade-1);
	border-radius: 8px;
}

label.tier .tier-text {
	display: flex;
	flex-flow: column;
	margin-bottom: auto;
}

label.tier .tier-name {
	color: var(--text-shade-3);
	font-weight: bold;
	font-size: 1.2rem;
}

label.tier .tier-perks {
	text-align: left;
	width: 70%;
	margin: 24px auto 48px;
}

label.tier .tier-perks p span {
	position: relative;
	top: 4px;
}

label.tier .tier-perks div {
	display: grid;
	grid-template-columns: 16px auto;
	gap: 8px;
}

label.tier p.price {
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	background: var(--bg-shade-4);
	margin: 0;
	padding: 1.5rem 1rem;
	box-sizing: border-box;
	border-radius: 0 0 10px 10px;
}
label.tier p.price span {
	font-size: 2rem;
	color: var(--text-shade-3);
	font-weight: bold;
	margin-right: 0.5ch;
}

form .button-wrapper {
	grid-column: 2 / span 1;
	position: relative;
	margin-top: 24px;
}
button {
	appearance: none;
	-webkit-appearance: none;
	display: block;
	font-family: Poppins, Arial, Helvetica, sans-serif;
	font-size: 1rem;
	height: fit-content;

	background: var(--accent-shade-0);
	border: none;
	border-radius: 4px;
	padding: 12px;
	color: var(--text-shade-3);
	width: 100%;

	transition: filter 300ms;
	pointer-events: all;
	cursor: pointer;
	filter: none;
}
form button:disabled {
	pointer-events: none;
	filter: brightness(0.75) saturate(0.75) !important; /* not using opacity here 'cause in the mobile layout you would see the cards under it */
	cursor: default;
}

.alertDialogRoot {
	position: absolute;
	background-color: #f00;
}

form button.unsubscribe {
	position: relative;
	background: none;
	color: var(--text-shade-1);
	margin-top: 12px;
	padding: 0;
}

@media screen and (max-width: 900px) {
	.account-form-wrapper {
		width: min(500px, 100%);
		margin-bottom: 172px;
	}

	form {
		grid-template-columns: 1fr;
		gap: 2.4rem;
	}

	form button {
		position: relative;
		width: 100%;
	}
	form .button-wrapper {
		grid-column: 1 / span 1;
		position: fixed;
		bottom: 24px;
		width: min(500px, 90%);
		z-index: 5;
	}
	form .button-wrapper::before {
		content: "";
		position: absolute;
		top: -24px;
		left: -100vw;
		width: 200vw;
		height: 300%;
		background: var(--bg-shade-0);
	}
}

@media screen and (max-width: 380px) {
	label.tier .tier-perks {
		width: 80%;
	}
	.back-arrow {
		padding: 6px;
	}
	.back-arrow span {
		display: none;
	}
}
</style>
