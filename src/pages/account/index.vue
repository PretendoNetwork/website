<script setup lang="ts">
interface InfoCCResponse {
	username: string;
	access_level: number;
	mii: {
		name: string;
		image_url: string;
	};
	connections: {
		stripe?: {
			tier_name?: string;
			tier_level?: string;
		};
	};
	birthdate: string;
	gender: string;
	country: string;
	timezone: {
		name: string;
	};
	server_access_level: string;
	email: {
		address: string;
	};
}

const account = await useFetch<InfoCCResponse>('/api/account/info'); // TODO: easy way to share this between navbar and account page? is that a good idea?
const showingEditingDisabledModal = ref(false);

</script>

<template>
  <div>
    <div
      v-if="account.data.value"
      class="account-wrapper"
    >
      <div class="account-sidebar">
        <div class="user">
          <a
            href="/account/miieditor"
            class="mii"
          >
            <img
              :src="account.data.value.mii.image_url"
              alt="Mii image"
            >
          </a>
          <p

            class="miiname"
          >
            {{ account.data.value.mii.name }}
          </p>
          <p
            class="username"
            :value="account.data.value.username"
          >
            PNID: {{ account.data.value.username }}
          </p>
          <p
            v-if="account.data.value.connections.stripe?.tier_name"
            :class="`tier-name tier-level-${account.data.value.connections.stripe?.tier_level}`"
            :value="account.data.value.connections.stripe?.tier_name"
          >
            {{ account.data.value.connections.stripe?.tier_name }}
          </p>
          <p
            v-else-if="account.data.value.access_level != -1"
            :class="`tier-name access-level-${account.data.value?.access_level}`"
            :value="$t(`account.accountLevel.${account.data.value.access_level}`)"
          >
            {{ $t(`account.accountLevel.${account.data.value.access_level}`) }}
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
          <a
            id="account-upgrade"
            class="button secondary"
            href="/account/upgrade"
          >
            <p class="caption">{{ $t("account.settings.upgrade") }}</p>
          </a>
        </div>
      </div>

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
          <a
            class="edit"
            @click="showingEditingDisabledModal = true"
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
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </a>
          <ul class="setting-list">
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.nickname") }}
              </p>
              <p class="value">
                {{ account.data.value.mii.name }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.birthDate") }}
              </p>
              <p class="value">
                {{ account.data.value.birthdate }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.gender") }}
              </p>
              <p class="value">
                {{ account.data.value.gender }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.country") }}
              </p>
              <p class="value">
                {{ account.data.value.country }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.timezone") }}
              </p>
              <p class="value">
                {{ account.data.value.timezone.name }}
              </p>
            </li>
          </ul>
        </div>

        <div class="setting-card">
          <h2 class="header">
            {{ $t("account.settings.settingCards.serverEnv") }}
          </h2>
          <fieldset
            :disabled="account.data.value.access_level < 1"
          >
            <form
              id="server"
              class="server-selection"
            >
              <input
                id="prod"
                type="radio"
                name="server_selection"
                value="prod"
                :checked="account.data.value.server_access_level == 'prod'"
              >
              <label for="prod">
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
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                  <polyline points="7.5 19.79 7.5 14.6 3 12" />
                  <polyline points="21 12 16.5 14.6 16.5 19.79" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line
                    x1="12"
                    y1="22.08"
                    x2="12"
                    y2="12"
                  />
                </svg>
                <h2>{{ $t("account.settings.settingCards.production") }}</h2>
              </label>
              <template v-if="account.data.value.access_level > 0">
                <input
                  id="beta"
                  type="radio"
                  name="server_selection"
                  value="test"
                  :checked="account.data.value.server_access_level == 'test'"
                >
                <label for="beta">
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
                  >
                    <polygon points="2,21 22,21 14,11.5 14,5 10,3 10,11.5" />
                  </svg>
                  <h2>{{ $t("account.settings.settingCards.beta") }}</h2>
                </label>
              </template>
            </form>
          </fieldset>
          <p v-if="account.data.value.access_level < 1">
            {{ $t("account.settings.settingCards.upgradePrompt") }}
          </p>
          <button
            v-else
            id="save-server-selection"
            class="button secondary"
          >
            Save
          </button>
          <p>{{ $t("account.settings.settingCards.hasAccessPrompt") }}</p>
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
          <a
            class="edit"
            @click="showingEditingDisabledModal = true"
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
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </a>
          <ul class="setting-list">
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.email") }}
              </p>
              <p class="value">
                {{ account.data.value.email.address }}
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
          <p>
            {{ $t("account.settings.settingCards.passwordResetNotice") }}
          </p>
        </div>

        <div class="setting-card sign-in-history">
          <h2 class="header">
            {{ $t("account.settings.settingCards.signInHistory") }}
          </h2>
          <p>{{ $t("account.settings.settingCards.no_signins_notice") }}</p>
          <!-- TODO: don't think this is even implemented properly now; commenting out for now
				<ul class="setting-list">
          {{#each account.devices }}
          <li>
            <p class="label">
              {{ device_attributes.name }}
            </p>
            <p class="value">
              {{ device_attributes.created_date }}
            </p>
          </li>
          {{/each}}
        </ul>
				-->
          <a href="/account/sign-in-history">
            <button class="button secondary">{{ $t("account.settings.settingCards.fullSignInHistory") }}</button>
          </a>
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
        <!--{{#if discordUser}}
        <p>{{ locale.account.settings.settingCards.connectedToDiscord }} {{ discordUser.username }}#{{ discordUser.discriminator }}</p>
        <a href="/account/remove/discord">
          <button
            id="remove-discord-connection"
            class="button secondary"
          >{{ locale.account.settings.settingCards.removeDiscord }}</button>
        </a>
        {{else}}
        <p>{{ locale.account.settings.settingCards.noDiscordLinked }} <a href="{{ discordAuthURL }}">{{ locale.account.settings.settingCards.linkDiscord }}</a></p>
        {{/if}}-->
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
    </div>
    <div
      id="edit-settings"
      :class="`modal-wrapper${showingEditingDisabledModal ? '' : ' hidden'}`"
    >
      <div class="modal">
        <h1 class="title dot">
          {{ $t("account.settings.unavailable") }}
        </h1>
        <p class="modal-caption">
          {{ $t("account.settings.settingCards.no_edit_from_dashboard") }}
        </p>
        <div class="modal-button-wrapper">
          <button
            id="editSettingsCloseButton"
            class="button primary confirm"
            @click="showingEditingDisabledModal = false"
          >
            {{ $t("modals.close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
	margin: 55px auto;
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
	color: #FF8484;
	border-color: rgba(255, 132, 132, 0.8);
}
.account-sidebar .user .tier-level-2 {
	background: rgba(89, 201, 165, 0.3);
	color:#59c9a5;
	border-color: #59c9a5;
}
.account-sidebar .user .tier-level-3 {
	background: rgba(202, 177, 251, 0.3);
	color:var(--accent-shade-3);
	border-color: var(--accent-shade-3);
}
.account-sidebar .user .access-level-banned {
	background: rgba(255, 63, 0, 0.1);
	color:#FF3F00;
	border-color: rgba(255, 63, 0, 0.8);
}
.account-sidebar .user .access-level-1 {
	background: rgba(100, 247, 239, 0.3);
	color: #64F7EF;
	border-color: #64F7EF;
}
.account-sidebar .user .access-level-2 {
	background: rgba(255, 199, 89, 0.3);
	color: #FFC759;
	border-color: #FFC759;
}
.account-sidebar .user .access-level-3 {
	background: rgba(90, 255, 21, 0.3);
	color:#5AFF15;
	border-color: #5AFF15;
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
	background: no-repeat center/40% url("/assets/images/edit.svg"), rgba(55, 60, 101, 0.7);
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
.account-sidebar .buttons a {
	display: flex;
	flex-flow: column;
	align-items: center;
	padding: 20px 24px;
	margin: 20px 0 0;
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
	border-radius: 100%;
	position: absolute;
	top: 42px;
	right: 48px;
	width: 24px;
	height: 24px;
	padding: 12px;
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
	position: fixed;
	top: -150px;
	width: 100%;
	animation: banner-notice 5s;
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
