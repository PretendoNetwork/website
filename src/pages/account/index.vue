<script setup lang="ts">
/* eslint-disable vue/no-v-html -- locale files still have raw html */
import { watchImmediate, watchOnce } from '@vueuse/core';
import { AlertDialog, Label, Dialog, Select, DatePicker } from 'reka-ui/namespaced';
import { parseDate } from '@internationalized/date';
import {
	getLocalizedRegionTimezones,
	getLocalizedTimezoneString,
	regionIdToLocalizedNames,
	getLocalizedCountryList,
	getLocalizedRegionList
} from '@/utils/localizeConsole';
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
const profileEditModalOpen = ref(false);
const emailEditModalOpen = ref(false);
const selectedServerEnv = ref<'dev' | 'test' | 'prod' | undefined>(
	profile.value?.serverAccessLevel
);

const newBirthday = shallowRef(parseDate(profile.value?.birthday || ''));
const newCountry = ref(((profile.value?.region || 0) >>> 24) & 0xff);
const newRegion = ref(profile.value?.region);
const newTimezone = ref(profile.value?.timezone);

const newLocalizedTimezoneList = computed(() => {
	return getLocalizedRegionTimezones(locale.value, newRegion.value);
});

const timezoneString = computed(() => {
	return getLocalizedTimezoneString(
		locale.value,
		profile.value?.region,
		profile.value?.timezone
	);
});

const regionStrings = computed(() => {
	return regionIdToLocalizedNames(locale.value, profile.value?.region);
});

const localizedCountryList = computed(() => {
	return getLocalizedCountryList(locale.value);
});

const newLocalizedRegionList = computed(() => {
	return getLocalizedRegionList(locale.value, newRegion.value);
});

watch(newCountry, () => {
	// if a new country has been picked, set the region to its 'Undefined' region.
	newRegion.value = newCountry.value * (2 ** 24);
});

watch(newRegion, (o, n) => {
	if ((((o || 0) >>> 24) & 0xff) === (((n || 0) >>> 24) & 0xff)) {
		// same country so we leave the timezone as is, else we might override the user's choice.
		return;
	}

	newTimezone.value = newLocalizedTimezoneList.value?.[0]?.area;
});

const {
	execute: executeUpdateServerEnvironment,
	isLoading: isLoadingUpdateServerEnv
} = useAsync({
	async handler(env: ApiAccountUpdateRequest['serverAccessLevel']) {
		await apiFetch('/api/account/update', {
			method: 'PATCH',
			body: {
				serverAccessLevel: env
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

const { execute: executeUpdateUserData, isLoading: isLoadingUpdateUserData } =
	useAsync({
		async handler(data: ApiAccountUpdateRequest) {
			await apiFetch('/api/account/update', {
				method: 'PATCH',
				body: data satisfies ApiAccountUpdateRequest
			});
			await refresh();
		},
		onError(error) {
			console.log(error);
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

	return new Date(Date.UTC(y, m, d)).toLocaleDateString(
		locale.value
	);
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
                {{ $t("account.settings.delete.modalTitle") }}?
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

    <div class="settings-wrapper">
      <h2
        id="user-settings"
        class="section-header"
      >
        {{ $t("account.settings.settingCards.userSettings") }}
      </h2>
      <Dialog.Root v-model:open="profileEditModalOpen">
        <div class="setting-card">
          <h2 class="header">
            {{ $t("account.settings.settingCards.profile") }}
          </h2>

          <Dialog.Trigger class="edit">
            <Icon
              name="ph:pencil"
              size="26"
            />
          </Dialog.Trigger>
          <Dialog.Portal :to="dialogContainer ?? undefined">
            <Dialog.Overlay />
            <Dialog.Content class="modal">
              <Dialog.Title>
                {{ $t("account.settings.settingCards.userSettings") }}.
              </Dialog.Title>
              <div class="fieldsets-container">
                <fieldset class="account-edit">
                  <Label
                    class="birthday"
                    for="birthday"
                  >
                    {{ $t("account.settings.settingCards.birthDate") }}</Label>
                  <DatePicker.Root
                    v-model="newBirthday"
                    :locale="locale"
                    granularity="day"
                    close-on-select
                  >
                    <DatePicker.Field
                      v-slot="{ segments }"
                      class="date-field"
                    >
                      <template
                        v-for="item in segments"
                        :key="item.part"
                      >
                        <DatePicker.Input
                          v-if="item.part === 'literal'"
                          :part="item.part"
                          class="date-field-literal"
                        >
                          {{ item.value }}
                        </DatePicker.Input>
                        <DatePicker.Input
                          v-else
                          :part="item.part"
                          class="date-field-segment"
                        >
                          {{ item.value }}
                        </DatePicker.Input>
                      </template>

                      <DatePicker.Trigger class="calendar-popover-trigger">
                        <Icon
                          name="ph:calendar-dots"
                          class="date-icon"
                        />
                      </DatePicker.Trigger>
                    </DatePicker.Field>

                    <DatePicker.Content
                      align="end"
                      class="calendar-popover-content"
                      :portal="{
                        disabled: true
                      }"
                    >
                      <DatePicker.Arrow class="calendar-popover-arrow" />
                      <DatePicker.Calendar
                        v-slot="{ weekDays, grid }"
                        class="calendar"
                      >
                        <DatePicker.Header class="calendar-header">
                          <DatePicker.Prev
                            class="calendar-nav-button"
                          >
                            <Icon
                              name="ph:caret-left"
                              class="date-icon"
                            />
                          </DatePicker.Prev>

                          <DatePicker.Heading class="calendar-heading" />
                          <DatePicker.Next
                            class="calendar-nav-button"
                          >
                            <Icon
                              name="ph:caret-right"
                              class="date-icon"
                            />
                          </DatePicker.Next>
                        </DatePicker.Header>
                        <div
                          class="calendar-wrapper"
                        >
                          <DatePicker.Grid
                            v-for="month in grid"
                            :key="month.value.toString()"
                            class="calendar-grid"
                          >
                            <DatePicker.GridHead>
                              <DatePicker.GridRow class="calendar-grid-row">
                                <DatePicker.HeadCell
                                  v-for="day in weekDays"
                                  :key="day"
                                  class="calendar-head-cell"
                                >
                                  {{ day }}
                                </DatePicker.HeadCell>
                              </DatePicker.GridRow>
                            </DatePicker.GridHead>
                            <DatePicker.GridBody>
                              <DatePicker.GridRow
                                v-for="(weekDates, index) in month.rows"
                                :key="`weekDate-${index}`"
                                class="calendar-grid-row"
                              >
                                <DatePicker.Cell
                                  v-for="weekDate in weekDates"
                                  :key="weekDate.toString()"
                                  :date="weekDate"
                                  class="calendar-cell"
                                >
                                  <DatePicker.CellTrigger
                                    :day="weekDate"
                                    :month="month.value"
                                    class="calendar-cell-trigger"
                                  />
                                </DatePicker.Cell>
                              </DatePicker.GridRow>
                            </DatePicker.GridBody>
                          </DatePicker.Grid>
                        </div>
                      </DatePicker.Calendar>
                    </DatePicker.Content>
                  </DatePicker.Root>
                </fieldset>

                <fieldset class="account-edit">
                  <Label
                    class="country"
                    for="country"
                  >
                    {{ $t("account.settings.settingCards.country") }}</Label>
                  <Select.Root v-model="newCountry">
                    <Select.Trigger
                      class="select-trigger"
                      aria-label="Select country"
                    >
                      <Select.Value />
                      <Icon name="ph:caret-down" />
                    </Select.Trigger>

                    <Select.Content
                      class="select-content"
                      position="popper"
                    >
                      <Select.ScrollUpButton class="select-scrollbutton">
                        <Icon name="ph:caret-up" />
                      </Select.ScrollUpButton>

                      <Select.Viewport class="select-viewport">
                        <Select.Item
                          v-for="c in localizedCountryList"
                          :key="c.id"
                          class="select-item"
                          :value="c.id"
                        >
                          <Select.ItemIndicator class="select-itemindicator">
                            <Icon name="ph:check" />
                          </Select.ItemIndicator>
                          <Select.ItemText>
                            {{ c.name }}
                          </Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>

                      <Select.ScrollDownButton class="select-scrollbutton">
                        <Icon name="ph:caret-down" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Root>
                </fieldset>

                <fieldset class="account-edit">
                  <Label
                    class="region"
                    for="region"
                  >{{
                    $t("account.settings.settingCards.region")
                  }}</Label>
                  <Select.Root v-model="newRegion">
                    <Select.Trigger
                      class="select-trigger"
                      aria-label="Select region"
                    >
                      <Select.Value />
                      <Icon name="ph:caret-down" />
                    </Select.Trigger>

                    <Select.Content
                      class="select-content"
                      position="popper"
                    >
                      <Select.ScrollUpButton class="select-scrollbutton">
                        <Icon name="ph:caret-up" />
                      </Select.ScrollUpButton>

                      <Select.Viewport class="select-viewport">
                        <Select.Item
                          v-for="r in newLocalizedRegionList"
                          :key="r.id"
                          class="select-item"
                          :value="r.id"
                        >
                          <Select.ItemIndicator class="select-itemindicator">
                            <Icon name="ph:check" />
                          </Select.ItemIndicator>
                          <Select.ItemText>
                            {{ r.name }}
                          </Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>

                      <Select.ScrollDownButton class="select-scrollbutton">
                        <Icon name="ph:caret-down" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Root>
                </fieldset>

                <fieldset class="account-edit">
                  <Label
                    class="timezone"
                    for="timezone"
                  >
                    {{ $t("account.settings.settingCards.timezone") }}</Label>
                  <Select.Root v-model="newTimezone">
                    <Select.Trigger
                      class="select-trigger"
                      aria-label="Select timezone"
                    >
                      <Select.Value />
                      <Icon name="ph:caret-down" />
                    </Select.Trigger>

                    <Select.Content
                      class="select-content"
                      position="popper"
                    >
                      <Select.ScrollUpButton class="select-scrollbutton">
                        <Icon name="ph:caret-up" />
                      </Select.ScrollUpButton>

                      <Select.Viewport class="select-viewport">
                        <Select.Item
                          v-for="tz in newLocalizedTimezoneList"
                          :key="tz.area"
                          class="select-item"
                          :value="tz.area"
                        >
                          <Select.ItemIndicator class="select-itemindicator">
                            <Icon name="ph:check" />
                          </Select.ItemIndicator>
                          <Select.ItemText>
                            {{ tz.area.replace("_", " ") }} - {{ tz.name }}
                          </Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>

                      <Select.ScrollDownButton class="select-scrollbutton">
                        <Icon name="ph:caret-down" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Root>
                </fieldset>
              </div>

              <div class="modal-button-wrapper">
                <Dialog.Close class="cancel">
                  {{ $t("modals.cancel") }}
                </Dialog.Close>
                <Dialog.Close
                  class="action"
                  @click="
                    () =>
                      executeUpdateUserData({
                        birthday: newBirthday.toString(),
                        region: newRegion,
                        timezone: newTimezone,
                      })
                  "
                >
                  <Loader v-if="isLoadingUpdateUserData" />
                  <span v-else>{{
                    $t("modals.confirm")
                  }}</span>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
          <ul class="setting-list">
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
                {{ $t("account.settings.settingCards.timezone") }}
              </p>
              <p class="value">
                {{ timezoneString }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.country") }}
              </p>
              <p class="value">
                {{ regionStrings?.country }}
              </p>
            </li>
            <li>
              <p class="label">
                {{ $t("account.settings.settingCards.region") }}
              </p>
              <p class="value">
                {{ regionStrings?.region }}
              </p>
            </li>
          </ul>
        </div>
      </Dialog.Root>

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
                profile.serverAccessLevel === 'test' || profile.accessLevel > 0
              "
              id="test"
              v-model="selectedServerEnv"
              type="radio"
              value="test"
            >
            <label
              v-if="
                profile.serverAccessLevel === 'test' || profile.accessLevel > 0
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
              v-if="
                profile.accessLevel === 3 || profile.serverAccessLevel === 'dev'
              "
              id="dev"
              v-model="selectedServerEnv"
              type="radio"
              value="dev"
            >

            <label
              v-if="
                profile.accessLevel === 3 || profile.serverAccessLevel === 'dev'
              "
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
          v-if="selectedServerEnv !== profile.serverAccessLevel"
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
      <AlertDialog.Root v-model:open="emailEditModalOpen">
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
      </AlertDialog.Root>

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
    <div
      :class="{
        'modal-wrapper': true,
        hidden: !(
          deleteModalOpen ||
          profileEditModalOpen ||
          emailEditModalOpen
        ),
      }"
    >
      <div class="modal-binder">
        <div ref="dialogContainer" />
      </div>
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

.modal-wrapper {
	padding: 1.5rem;
	box-sizing: border-box;
}

.modal-binder {
	height: 100%;
	flex-grow: 9;
	width: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
}
.modal-binder > div {
	max-height: 100%;
	height: fit-content;
}

fieldset {
	position: relative;
	display: flex;
	flex-flow: column;
	height: min-content;
	padding: 0;
	gap: .25rem;
	border: none;
}

.fieldsets-container {
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: 1fr;
	gap: 1rem
}

div.modal input {
	background-color: var(--bg-shade-2);
}

.select-trigger,
.select-item {
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 4px;
	padding: 12px;
	line-height: 1;
	height: 3em;
	background-color: var(--bg-shade-3);
	color: var(--text-shade-3);
	width: 100%;
}

.select-item {
	background: none;
}
.select-trigger:hover {
	background-color: var(--bg-shade-4);
}
.select-trigger:focus {
	box-shadow: 0 0 0 2px #fff;
}

:deep(.select-content) {
	overflow: hidden;
	background-color: var(--bg-shade-3);
	margin: .25rem 0;
	border-radius: 6px;
	max-height: min(var(--reka-select-content-available-height), 420px);
	height: fit-content;
	width: var(--reka-select-trigger-width);
	box-shadow:
		0px 10px 38px -10px rgba(22, 23, 24, 0.4),
		0px 10px 20px -15px rgba(22, 23, 24, 0.2);
}

:deep(.select-content[data-state='open']),
:deep(.date-picker-content[data-state='open']),
:deep(div:has(> .calendar-popover-content[data-state='open'])) {
	z-index: 100 !important;
}

.select-item {
	border-radius: 3px;
	display: flex;
	align-items: center;
	padding: 0 35px 0 25px;
	position: relative;
	user-select: none;
	color: var(--text-shade-2);
	cursor: pointer;
}
.select-item[data-disabled] {
	color: var(--text-shade-1);
	pointer-events: none;
}
.select-item[data-highlighted] {
	outline: none;
	background-color: var(--bg-shade-4);
	color: var(--text-shade-3);
}
.select-item[data-state='checked'] {
	color: var(--text-shade-3);
}

.select-label {
	padding: 0 25px;
	font-size: 12px;
	line-height: 25px;
	color: var(--mauve-11);
}

.select-separator {
	height: 1px;
	background-color: var(--grass-6);
	margin: 5px;
}

.select-itemindicator {
	position: absolute;
	left: 0;
	width: 25px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.select-scrollbutton {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 25px;
	background-color: var(--bg-shade-3);
	color: var(--grass-11);
	cursor: default;
}

.date-field {
  display: flex;
  padding: 12px;
	height: 3rem;
  align-items: center;
  border-radius: 4px;
  text-align: center;
  background-color: var(--bg-shade-3);
  user-select: none;
  color: var(--text-shade-3);
	box-sizing: border-box;
}

.date-field[data-invalid] {
  border: 1px solid var(--red-shade-2);
}

.date-field-literal {
  padding: 0.25rem;
}

.date-field-segment {
  padding: 0.25rem;
	border-radius: 4px;
}

.date-field-segment:hover{
  background-color: var(--bg-shade-4);
}

.date-field-segment:focus {
  background-color: var(--bg-shade-4);
	outline: 2px solid var(--text-shade-3)
}

.date-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.calendar {
	width: 100%;
	box-sizing: border-box;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-nav-button {
	all: unset;
	cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: transparent;
  cursor: pointer;
}

.calendar-nav-button:hover {
  color: var(--text-shade-2);
}

.calendar-heading {
  font-weight: 500;
  color: 15px;
}

.calendar-wrapper {
  display: flex;

  flex-direction: column;
}

.calendar-grid {
  margin-top: 0.25rem;
  width: 100%;
  user-select: none;
  border-collapse: collapse;
}

.calendar-grid-row {
  display: grid;
  margin-bottom: 0.25rem;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  width: 100%;
}

.calendar-head-cell {
  border-radius: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--text-shade-1);
  font-weight: 400;
	text-align: center;
	margin-bottom: .5rem;
}

.calendar-cell {
  position: relative;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
}

.calendar-cell-trigger {
  display: flex;
  position: relative;
  padding: 0.25rem .5rem;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: transparent;
  outline-style: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
  color: var(--text-shade-3);
  white-space: nowrap;
  background-color: transparent;
	border-radius: 4px;
}

.calendar-cell-trigger:hover {
  border-color: var(--text-shade-3);
}

.calendar-cell-trigger:focus {
  box-shadow: 0 0 0 2px var(--text-shade-3);;
}

.calendar-cell-trigger[data-selected] {
  background-color: var(--text-shade-3);
  color: var(--bg-shade-3);
  font-weight: bold;
}

.calendar-cell-trigger[data-selected]::before {
  background-color: #FFFFFF;
}

.calendar-cell-trigger[data-outside-view] {
  color: var(--text-shade-1);
}

.calendar-popover-trigger {
	all: unset;
	cursor: pointer;
	margin-left: auto;
	display: flex;
}

.calendar-popover-trigger:focus {
  box-shadow: 0 0 0 2px #000000;
}

:deep(.calendar-popover-content) {
  border-radius: 4px;
  padding: 24px;
  width: 260px;
  background-color: var(--bg-shade-3-5);
	color: var(--text-shade-3);
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
:deep(.calendar-popover-content):focus {
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px,
    0 0 0 2px var(--grass-7);
}
:deep(.calendar-popover-content)[data-state='open'][data-side='top'] {
  animation-name: slideDownAndFade;
}
:deep(.calendar-popover-content)[data-state='open'][data-side='right'] {
  animation-name: slideLeftAndFade;
}
:deep(.calendar-popover-content)[data-state='open'][data-side='bottom'] {
  animation-name: slideUpAndFade;
}
:deep(.calendar-popover-content)[data-state='open'][data-side='left'] {
  animation-name: slideRightAndFade;
}

:deep(.calendar-popover-arrow) {
  fill: var(--bg-shade-3-5);
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
	padding: 30px 10px;
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
