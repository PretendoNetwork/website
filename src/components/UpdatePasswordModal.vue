<script setup lang="ts">
import { Dialog } from 'reka-ui/namespaced';
import type { ApiAccountPasswordUpdateRequest } from '~~/shared/api-types';

const toasts = useToasts();
const authUtils = useAuthUtils();
const { t } = useI18n();

const { dialogContainer } = defineProps<{
	dialogContainer: HTMLElement | null;
}>();
const open = defineModel<boolean>();

const oldPassword = ref('');
const newPassword = ref('');
const newPasswordConfirm = ref('');

const hasRequiredInfo = computed(() => {
	return oldPassword.value && newPassword.value && newPasswordConfirm.value;
});

const emit = defineEmits<{
	change: [];
}>();

const {
	execute: executeUpdatePassword,
	isLoading: isLoadingUpdatePassword
} = useAsync({
	async handler() {
		await apiFetch('/api/account/update-password', {
			method: 'PATCH',
			body: {
				oldPassword: oldPassword.value,
				newPassword: newPassword.value,
				newPasswordConfirm: newPasswordConfirm.value
			} satisfies ApiAccountPasswordUpdateRequest
		});

		open.value = false;
		toasts.publish({
			type: 'success',
			text: t('account.settings.passwordModal.successNotice')
		});

		emit('change');
		authUtils.logout();
	},
	onError(error) {
		const err = getApiError(error);
		toasts.publish({
			type: 'error',
			text: err.message
		});
	}
});

</script>

<template>
  <Dialog.Root
    v-model:open="open"
  >
    <Dialog.Portal :to="dialogContainer ?? undefined">
      <Dialog.Overlay />
      <Dialog.Content
        class="modal"
        @interact-outside="(e) => {
          if (isLoadingUpdatePassword) {
            return e.preventDefault();
          }
        }"
      >
        <Dialog.Title>
          {{ $t("account.settings.passwordModal.title") }}.
        </Dialog.Title>
        <Dialog.Description class="modal-caption">
          <p>
            {{
              $t("account.settings.settingCards.passwordResetNotice")
            }}
          </p>
        </Dialog.Description>
        <div class="fieldsets-container">
          <fieldset class="account-edit">
            <Label for="old-password">{{ $t("account.settings.passwordModal.oldPassword") }}</Label>
            <input
              id="old-password"
              v-model="oldPassword"
              name="old-password"
              type="password"
              autocomplete="current-password"
              required
            >
          </fieldset>
          <fieldset class="account-edit">
            <Label for="new-password">{{ $t("account.settings.passwordModal.newPassword") }}</Label>
            <input
              id="new-password"
              v-model="newPassword"
              name="new-password"
              type="password"
              autocomplete="new-password"
              passwordrules="minlength: 6; maxlength: 16; max-consecutive: 2; allowed: [-!-~];"
              pattern="[-!-~]{6,16}"
              required
            >
          </fieldset>
          <fieldset class="account-edit">
            <Label for="new-password-confirm">{{ $t("account.settings.passwordModal.newPasswordConfirm") }}</Label>
            <input
              id="new-password-confirm"
              v-model="newPasswordConfirm"
              name="new-password-confirm"
              type="password"
              autocomplete="new-password"
              passwordrules="minlength: 6; maxlength: 16; max-consecutive: 2; allowed: [-!-~];"
              pattern="[-!-~]{6,16}"
              required
            >
          </fieldset>
        </div>
        <div class="modal-button-wrapper">
          <Dialog.Close
            class="cancel"
            :disabled="isLoadingUpdatePassword"
          >
            {{ $t("modals.cancel") }}
          </Dialog.Close>
          <button
            :class="{action: true, disabled: isLoadingUpdatePassword || !hasRequiredInfo }"
            :disabled="isLoadingUpdatePassword || !hasRequiredInfo"
            @click="executeUpdatePassword"
          >
            <Loader v-if="isLoadingUpdatePassword" />
            <span v-else>{{
              $t("modals.confirm")
            }}</span>
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal><Dialog.Trigger class="update-trigger">
      {{ $t('account.settings.update') }}
    </Dialog.Trigger>
  </Dialog.Root>
</template>
<style scoped>
.fieldsets-container {
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: 1fr;
	gap: 1rem
}

.update-trigger {
	all: unset;
	color: var(--accent-shade-1);
	font-weight: bold;
	cursor: pointer;
}
.update-trigger:hover {
	background: none;
	text-decoration: underline;
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
</style>
