<script setup lang="ts">
/* eslint-disable vue/no-v-html -- locale files still have raw html */
import { watchImmediate } from '@vueuse/core';
import { AlertDialog } from 'reka-ui/namespaced';
import type { ApiAccountUpdateRequest } from '~~/shared/api-types';

const { locale } = useI18n();

const authStore = useAuthStore();
const toasts = useToasts();
const route = useRoute();
definePageMeta({
	needsAuth: true
});

const upgradeSuccessQuery = computed(() => route.query.upgrade_success);
watchImmediate(upgradeSuccessQuery, (val) => {
	if (!val) {
		return;
	}
	if (val === 'true') {
		toasts.publish({
			type: 'success',
			text: 'Account upgraded successfully'
		});
	}
	if (val === 'false') {
		toasts.publish({
			type: 'error',
			text: 'Account upgrade failed'
		});
	}
	useRouter().replace({ query: {} });
});

const discordLinkQuery = computed(() => route.query.discord_link_success);
watchImmediate(discordLinkQuery, (val) => {
	if (!val) {
		return;
	}
	if (val === 'true') {
		toasts.publish({
			type: 'success',
			text: 'Discord account linked successfully'
		});
	}
	if (val === 'false') {
		toasts.publish({
			type: 'error',
			text: 'Failed to link Discord account'
		});
	}
	useRouter().replace({ query: {} });
});

const { data: profile, refresh } = await useApiFetch('/api/auth/me');
const { data: connections, refresh: refreshConnections } = await useApiFetch(
	'/api/auth/me-connections'
);

const dialogContainer = ref(null);
const deleteModalOpen = ref(false);
const editModalOpen = ref(false);
const selectedServerEnv = ref<'dev' | 'test' | 'prod' | undefined>(profile.value?.serverAccessLevel);

const {
	execute: executeUpdateServerEnvironment,
	isLoading: isLoadingUpdateServerEnv
} = useAsync({
	async handler(env: ApiAccountUpdateRequest['environment']) {
		await apiFetch('/api/account/update', {
			method: 'PATCH',
			body: {
				environment: env
			} satisfies ApiAccountUpdateRequest
		});
		await refresh();
	},
	onError(error) {
		const err = getApiError(error);
		toasts.publish({
			type: 'error',
			text: err.message
		});
	}
});

const { execute: executeDeleteAccount, isLoading: isLoadingDelete } = useAsync({
	async handler() {
		await apiFetch('/api/account/delete', {
			method: 'POST'
		});
		authStore.logout();
		await navigateTo('/');
	},
	onError(error) {
		const err = getApiError(error);
		toasts.publish({
			type: 'error',
			text: err.message
		});
	}
});

const { execute: executeLinkDiscord, isLoading: isLoadingLink } = useAsync({
	async handler() {
		const result = await apiFetch('/api/account/discord-link', {
			method: 'GET'
		});
		await navigateTo(result.url, { external: true });
	},
	onError(error) {
		const err = getApiError(error);
		toasts.publish({
			type: 'error',
			text: err.message
		});
	}
});

const { execute: executeUnlinkDiscord, isLoading: isLoadingUnlink } = useAsync({
	async handler() {
		await apiFetch('/api/account/discord-unlink', {
			method: 'POST'
		});
		await refresh();
		await refreshConnections();
	},
	onError(error) {
		const err = getApiError(error);
		toasts.publish({
			type: 'error',
			text: err.message
		});
	}
});

function parseBirthday(iso: string): string {
	const s = iso.split('-');

	const y = Number(s[0]);
	const m = Number(s[1]) - 1;
	const d = Number(s[2]);

	return new Date(Date.UTC(y, m, d)).toLocaleDateString(locale as unknown as string);
}

useHead({
	title: `Account`
});
</script>

<template>
  <div
    v-if="profile"
    class="account-wrapper"
  >
    <div class="account-sidebar">
      <div class="user">
        <a
          href="/account/miieditor"
          class="mii"
        >
          <img
            :src="profile.mii?.imageUrl"
            alt="Mii image"
          >
        </a>
        <p class="miiname">
          {{ profile.mii?.name }}
        </p>
        <p
          class="username"
          :value="profile.username"
        >
          PNID: {{ profile.username }}
        </p>
        <p
          v-if="profile.stripeTier?.tierName"
          :class="`tier-name access-level-${profile.accessLevel}`"
          :value="profile.stripeTier?.tierName"
        >
          {{ profile.stripeTier?.tierName }}
        </p>
        <p
          v-else-if="profile.accessLevel !== -1"
          :class="`tier-name access-level-${profile.accessLevel}`"
          :value="$t(`account.accountLevel[${profile.accessLevel}]`)"
        >
          {{ $t(`account.accountLevel[${profile.accessLevel}]`) }}
        </p>

        <p
          v-else
          class="tier-name access-level-banned"
          :value="$t('account.banned')"
        >
          {{ $t("account.banned") }}
        </p>
      </div>
      <div class="buttons">
        <NuxtLink
          id="account-upgrade"
          class="button secondary"
          to="/account/upgrade"
        >
          <p class="caption">
            {{ $t("account.settings.upgrade") }}
          </p>
        </NuxtLink>
        <AlertDialog.Root v-model:open="deleteModalOpen">
          <AlertDialog.Trigger
            id="account-delete"
            class="secondary"
          >
            {{ $t("account.settings.delete.button") }}
          </AlertDialog.Trigger>
          <AlertDialog.Portal :to="dialogContainer ?? undefined">
            <AlertDialog.Overlay />
            <AlertDialog.Content class="modal">
              <AlertDialog.Title>
                {{
                  $t("account.settings.delete.modalTitle")
                }}?
              </AlertDialog.Title>
              <AlertDialog.Description class="modal-caption">
                <p style="white-space: pre-line">
                  {{ $t("account.settings.delete.modalDescription") }}
                </p>
                <p class="noundo">
                  {{ $t("account.settings.delete.modalCaution") }}
                </p>
              </AlertDialog.Description>
              <div class="modal-button-wrapper">
                <AlertDialog.Cancel
                  :disabled="isLoadingDelete"
                  class="cancel"
                >
                  {{ $t("modals.cancel") }}
                </AlertDialog.Cancel>
                <button
                  class="alert"
                  @click="executeDeleteAccount"
                >
                  <Loader v-if="isLoadingDelete" />
                  <span v-else>{{
                    $t("account.settings.delete.modalConfirm")
                  }}</span>
                </button>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
    <AlertDialog.Root v-model:open="editModalOpen">
      <div class="settings-wrapper">
        <h2
          id="user-settings"
          class="section-header"
        >
          {{ $t("account.settings.settingCards.userSettings") }}
        </h2>
        <div class="setting-card">
          <h2 class="header">
            {{ $t("account.settings.settingCards.profile") }}
          </h2>

          <AlertDialog.Trigger class="edit">
            <Icon
              name="ph:pencil"
              size="26"
            />
          </AlertDialog.Trigger>
          <AlertDialog.Portal :to="dialogContainer ?? undefined">
            <AlertDialog.Overlay />
            <AlertDialog.Content class="modal">
              <AlertDialog.Title>
                {{ $t("account.settings.unavailable") }}.
              </AlertDialog.Title>
              <AlertDialog.Description class="modal-caption">
                <p>
                  {{
                    $t("account.settings.settingCards.no_edit_from_dashboard")
                  }}
                </p>
              </AlertDialog.Description>
              <div class="modal-button-wrapper">
                <AlertDialog.Cancel class="cancel">
                  {{ $t("modals.close") }}
                </AlertDialog.Cancel>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
          <ul class="setting-list">
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.nickname") }}
              </p>
              <p class="value">
                {{ profile.mii?.name }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.birthDate") }}
              </p>
              <p class="value">
                {{ parseBirthday(profile.birthday) }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.gender") }}
              </p>
              <p class="value">
                {{ profile.gender }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.country") }}
              </p>
              <p class="value">
                {{ profile.country }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.timezone") }}
              </p>
              <p class="value">
                {{ profile.timezone.replaceAll('_', ' ') }}
              </p>
            </li>
          </ul>
        </div>

        <div class="setting-card">
          <h2 class="header">
            {{ $t("account.settings.settingCards.serverEnv") }}
          </h2>
          <fieldset
            :disabled="
              profile.serverAccessLevel === 'prod' && profile.accessLevel < 1
            "
          >
            <form
              id="server"
              class="server-selection"
            >
              <input
                id="prod"
                v-model="selectedServerEnv"
                type="radio"
                value="prod"
              >
              <label for="prod">
                <Icon
                  name="ph:cube"
                  size="36"
                />
                <h2>{{ $t("account.settings.settingCards.production") }}</h2>
              </label>

              <input
                v-if="
                  profile.serverAccessLevel !== 'prod' ||
                    profile.accessLevel > 0
                "
                id="test"
                v-model="selectedServerEnv"
                type="radio"
                value="test"
              >
              <label
                v-if="
                  profile.serverAccessLevel !== 'prod' ||
                    profile.accessLevel > 0
                "
                for="test"
              >
                <Icon
                  name="ph:flask"
                  size="36"
                />
                <h2>{{ $t("account.settings.settingCards.beta") }}</h2>
              </label>

              <input
                v-if="profile.accessLevel === 3"
                id="dev"
                v-model="selectedServerEnv"
                type="radio"
                value="dev"
              >

              <label
                v-if="profile.accessLevel === 3"
                for="dev"
              >
                <Icon
                  name="ph:code"
                  size="36"
                />
                <h2>Dev</h2>
              </label>
            </form>
          </fieldset>

          <button
            v-if="
              profile.accessLevel >= 1 &&
                selectedServerEnv !== profile.serverAccessLevel
            "
            id="save-server-selection"
            class="button secondary"
            @click.prevent="
              () => executeUpdateServerEnvironment(selectedServerEnv)
            "
          >
            <Loader v-if="isLoadingUpdateServerEnv" />
            <span v-else>Save</span>
          </button>
          <p
            v-html="
              profile.accessLevel < 1
                ? $t('account.settings.settingCards.upgradePrompt')
                : $t('account.settings.settingCards.hasAccessPrompt')
            "
          />
        </div>

        <h2
          id="security"
          class="section-header"
        >
          {{ $t("account.settings.settingCards.signInSecurity") }}
        </h2>
        <div class="setting-card">
          <h2 class="header">
            {{ $t("account.account") }}
          </h2>
          <AlertDialog.Trigger class="edit">
            <Icon
              name="ph:pencil"
              size="26"
            />
          </AlertDialog.Trigger>
          <ul class="setting-list">
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.email") }}
              </p>
              <p class="value">
                {{ profile.emailAddress }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.password") }}
              </p>
              <p class="value">
                ●●●●●●●●
              </p>
            </li>
          </ul>
          <p>{{ $t("account.settings.settingCards.passwordResetNotice") }}</p>
        </div>

        <div class="setting-card sign-in-history">
          <h2 class="header">
            {{ $t("account.settings.settingCards.signInHistory") }}
          </h2>
          <p>{{ $t("account.settings.settingCards.no_signins_notice") }}</p>
        </div>

        <h2
          id="other"
          class="section-header"
        >
          {{ $t("account.settings.settingCards.otherSettings") }}
        </h2>
        <div class="setting-card">
          <h2 class="header">
            {{ $t("account.settings.settingCards.discord") }}
          </h2>

          <p
            v-if="profile.discordId"
            class="discord-profile"
          >
            {{ $t("account.settings.settingCards.connectedToDiscord") }}
            <img
              :style="{ height: '25px', width: '25px', borderRadius: '100px' }"
              :src="connections?.discord?.avatarUrl ?? '#'"
            >@{{ connections?.discord?.username }}.
          </p>

          <button
            v-if="profile.discordId"
            id="remove-discord-connection"
            class="button secondary"
            @click="executeUnlinkDiscord"
          >
            <Loader v-if="isLoadingUnlink" />
            <span v-else>{{
              $t("account.settings.settingCards.removeDiscord")
            }}</span>
          </button>
          <p v-else>
            {{ $t("account.settings.settingCards.noDiscordLinked") }}
            <NuxtLink
              :style="{ cursor: 'pointer' }"
              @click="executeLinkDiscord"
            >
              <Loader v-if="isLoadingLink" />
              <span v-else>{{
                $t("account.settings.settingCards.linkDiscord")
              }}</span>
            </NuxtLink>
          </p>
        </div>

        <div class="setting-card">
          <h2 class="header">
            {{ $t("account.settings.settingCards.newsletter") }}
          </h2>
          <p>{{ $t("account.settings.settingCards.no_newsletter_notice") }}</p>
          <!--
				<form id="other">
					<input type="checkbox" id="marketing" name="marketing" {{#if account.flags.marketing}}checked{{/if}}>
					<label for="marketing">{{ locale.account.settings.settingCards.newsletterPrompt }}</label>
				</form>
				-->
        </div>
      </div>
    </AlertDialog.Root>
    <div
      id="delete-account"
      :class="{
        'modal-wrapper': true,
        hidden: !(deleteModalOpen || editModalOpen),
      }"
    >
      <div ref="dialogContainer" />
    </div>
  </div>
</template>

<style scoped>
/* Removing until it's done */
.sign-in-history a {
	display: none;
}

.account-wrapper {
	display: grid;
	column-gap: 48px;
	margin-top: 80px;
	color: var(--text-shade-1);
}

/* Account settings sidebar */
.account-sidebar .user {
	margin: 55px auto auto;
	width: fit-content;
	display: flex;
	flex-flow: column;
	align-items: center;
}
.account-sidebar .user .miiname {
	font-size: 1.2rem;
	color: var(--text-shade-3);
	margin: 8px 0 4px;
}
.account-sidebar .user .username {
	margin: 0;
}
.account-sidebar .user .tier-name {
	margin: 12px 0;
	line-height: 1.2em;
	border-radius: 1.2em;
	border-width: 2px;
	border-style: solid;
	padding: 4px 16px;
}

.account-sidebar .user .tier-level-0,
.account-sidebar .user .access-level-0 {
	background: #2a2f50;
	color: var(--text-shade-1);
	border-color: #383f6b;
}
.account-sidebar .user .tier-level-1 {
	background: rgba(255, 132, 132, 0.2);
	color: #ff8484;
	border-color: rgba(255, 132, 132, 0.8);
}
.account-sidebar .user .tier-level-2 {
	background: rgba(89, 201, 165, 0.3);
	color: #59c9a5;
	border-color: #59c9a5;
}
.account-sidebar .user .tier-level-3 {
	background: rgba(202, 177, 251, 0.3);
	color: var(--accent-shade-3);
	border-color: var(--accent-shade-3);
}
.account-sidebar .user .access-level-banned {
	background: rgba(255, 63, 0, 0.1);
	color: #ff3f00;
	border-color: rgba(255, 63, 0, 0.8);
}
.account-sidebar .user .access-level-1 {
	background: rgba(100, 247, 239, 0.3);
	color: #64f7ef;
	border-color: #64f7ef;
}
.account-sidebar .user .access-level-2 {
	background: rgba(255, 199, 89, 0.3);
	color: #ffc759;
	border-color: #ffc759;
}
.account-sidebar .user .access-level-3 {
	background: rgba(90, 255, 21, 0.3);
	color: #5aff15;
	border-color: #5aff15;
}

.account-sidebar .user a.mii {
	position: relative;
	display: block;
	width: 128px;
	height: 128px;
	overflow: hidden;
	border-radius: 100%;
	background: var(--bg-shade-3);
}
.account-sidebar .user a.mii::after {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background:
		no-repeat center/50% url("@/public/assets/images/edit.svg"),
		rgba(55, 60, 101, 0.7);
	opacity: 0;
	transition: opacity 150ms;
}
.account-sidebar .user a.mii:hover::after {
	opacity: 1;
}

.account-sidebar .user .mii {
	width: 100%;
	height: 100%;
}
.account-sidebar .buttons {
	display: grid;
	grid-auto-flow: row;
	gap: 16px;
}
.account-sidebar .buttons a {
	display: flex;
	flex-flow: column;
	align-items: center;
	margin: 20px 0 0 0;
	text-decoration: none;
	text-align: center;
}
.account-sidebar .buttons a svg {
	margin-bottom: 16px;
}
.account-sidebar .buttons a p.caption {
	margin: 0;
}
.account-sidebar .buttons p.cemu-warning {
	margin: 4px 0 0;
	font-size: 0.7rem;
	color: var(--text-shade-1);
}

.account-sidebar .buttons #account-delete {
	background: var(--red-shade-2);
}

.modal p.noundo {
	font-weight: bold;
	color: var(--text-shade-3);
}

/* Settings */
.settings-wrapper {
	display: grid;
	grid-column-start: 2;
	grid-template-columns: 1fr 1fr;
	column-gap: 20px;
}
.settings-wrapper a {
	color: var(--accent-shade-1);
	text-decoration: none;
	font-weight: bold;
}
.settings-wrapper a:hover {
	text-decoration: underline;
}
.settings-wrapper h2.section-header {
	margin-top: 40px;
	grid-column: 1 / 3;
	color: var(--text-shade-3);
}

.setting-card {
	display: grid;
	grid-template-rows: 35px repeat(2, auto);
	row-gap: 24px;
	position: relative;
	border-radius: 10px;
	background: var(--bg-shade-2);
	padding: 48px 60px;
}
.setting-card * {
	margin: 0;
}
.setting-card .edit {
	color: var(--text-shade-1);
	background: var(--bg-shade-3);
	border-radius: 10000px;
	position: absolute;
	top: 42px;
	right: 48px;
	width: 48px;
	height: 48px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.setting-card .edit:hover {
	background: var(--bg-shade-3);
	color: var(--text-shade-3);
}
.setting-card .edit svg {
	pointer-events: none;
}

.setting-card .header {
	color: var(--text-shade-3);
}

.setting-card .setting-list {
	display: grid;
	grid-template-columns: repeat(2, auto);
	gap: 24px;
	list-style: none;
	padding: 0;
}
.setting-card .setting-list p.label {
	color: var(--text-shade-3);
	margin-bottom: 4px;
}

fieldset {
	position: relative;
	height: min-content;
	padding: 0;
	border: none;
}

.setting-card .server-selection {
	display: flex;
	border-radius: 5px;
	overflow: hidden;
	background: var(--bg-shade-3);
}
.setting-card .server-selection input {
	display: none;
}
.server-selection input + label {
	display: flex;
	flex-flow: column;
	align-items: center;
	flex: 50%;
	color: var(--text-shade-1);
	padding: 40px;
	justify-content: space-between;
	cursor: pointer;
}
.server-selection input + label h2 {
	margin-top: 12px;
	color: var(--text-shade-1);
}
.server-selection input:checked + label,
.server-selection input:checked + label h2 {
	background: var(--accent-shade-0);
	color: var(--text-shade-3);
}

.setting-card #link-discord-account {
	width: 100%;
	padding: 12px 48px;
	cursor: pointer;
	background: var(--bg-shade-3);
}

.setting-card .discord-profile {
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

.setting-card button {
	width: 100%;
	height: fit-content;
	padding: 12px 48px;
	align-self: flex-end;
	cursor: pointer;
	background: var(--bg-shade-3);
}

.setting-card.span-both-columns {
	grid-column: 1 / span 2;
}

@keyframes banner-notice {
	0% {
		top: -150px;
	}
	20% {
		top: 35px;
	}
	80% {
		top: 35px;
	}
	100% {
		top: -150px;
	}
}
.banner-notice {
	display: flex;
	justify-content: center;
	position: absolute;
	top: -150px;
	left: 0;
	width: 100vw;
	animation: banner-notice 5s;
	z-index: 100;
	color: var(--text-shade-3);
}
.banner-notice div {
	padding: 4px 36px;
	border-radius: 5px;
	z-index: 3;
}
.banner-notice.success div {
	background: var(--green-shade-0);
}
.banner-notice.error div {
	background: var(--red-shade-1);
}

footer {
	margin-top: 80px;
}

@media screen and (max-width: 1300px) {
	.account-wrapper {
		margin: 20px 0;
	}

	.settings-wrapper {
		grid-column-start: 1;
	}

	.account-sidebar {
		margin: 0;
	}

	.account-sidebar .user .mii {
		width: 128px;
		height: 128px;
	}
}

@media screen and (max-width: 1000px) {
	.settings-wrapper {
		display: block;
		width: 100%;
	}

	.setting-card {
		margin-bottom: 24px;
	}
}

@media screen and (max-width: 550px) {
	.setting-card {
		padding: 24px;
		width: calc(100vw - 48px);
		margin-left: -5vw;
		margin-right: -2.5vw;
		border-radius: 0;
		margin-bottom: 12px;
	}

	.setting-card .edit {
		top: 20px;
		right: 20px;
		transform: scale(0.85);
	}

	.setting-card .server-selection {
		flex-flow: column;
	}
}

@media screen and (max-width: 350px) {
	.setting-card .setting-list {
		grid-template-columns: auto;
	}
}
</style>
