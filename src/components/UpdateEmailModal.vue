<script setup lang="ts">
import { Dialog } from 'reka-ui/namespaced';
import type { ApiAccountEmailUpdateRequest, GetApiAuthMe } from '~~/shared/api-types';

const toasts = useToasts();
const open = defineModel<boolean>();

const newEmail = ref('');

const { profile } = defineProps<{
	profile: GetApiAuthMe;
	dialogContainer: HTMLElement | null;
}>();
const emit = defineEmits<{
	change: [];
}>();

const {
	execute: executeUpdateEmail,
	isLoading: isLoadingUpdateEmail
} = useAsync({
	async handler() {
		await apiFetch('/api/account/update-email', {
			method: 'PATCH',
			body: {
				email: newEmail.value
			} satisfies ApiAccountEmailUpdateRequest
		});

		open.value = false;
		emit('change');
		toasts.publish({
			type: 'success',
			text: 'A confirmation email has been sent to your inbox.'
		});
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
    v-if="profile.emailValidated"
    v-model:open="open"
  >
    <Dialog.Portal :to="dialogContainer ?? undefined">
      <Dialog.Overlay />
      <Dialog.Content
        class="modal"
        @interact-outside="(e) => {
          if (isLoadingUpdateEmail) {
            return e.preventDefault();
          }
        }"
      >
        <Dialog.Title>
          {{ $t("account.settings.emailModal.title") }}.
        </Dialog.Title>
        <Dialog.Description class="modal-caption">
          <p>
            {{
              $t("account.settings.emailModal.caption")
            }}
          </p>
        </Dialog.Description>
        <fieldset class="account-edit">
          <input
            id="new-email"
            v-model="newEmail"
            name="new-email"
            type="email"
            required
          >
        </fieldset>
        <div class="modal-button-wrapper">
          <Dialog.Close
            class="cancel"
            :disabled="isLoadingUpdateEmail"
          >
            {{ $t("modals.cancel") }}
          </Dialog.Close>
          <button
            :class="{action: true, disabled: isLoadingUpdateEmail || !newEmail}"
            :disabled="isLoadingUpdateEmail || !newEmail"
            @click="executeUpdateEmail"
          >
            <Loader v-if="isLoadingUpdateEmail" />
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

  <Dialog.Root
    v-else
    v-model:open="open"
  >
    <Dialog.Portal :to="dialogContainer ?? undefined">
      <Dialog.Overlay />
      <Dialog.Content
        class="modal"
      >
        <Dialog.Title>
          {{ $t("account.settings.unverifiedEmailModal.title") }}.
        </Dialog.Title>
        <Dialog.Description class="modal-caption">
          <p>
            {{
              $t("account.settings.unverifiedEmailModal.caption")
            }}
          </p>
          <p>
            {{ $t('account.settings.unverifiedEmailModal.lostEmail') }}
            <button
              :class="{
                'update-trigger':
                  true,
                disabled:
                  isLoadingUpdateEmail
              }"
              :disabled="isLoadingUpdateEmail"
              @click="() => executeUpdateEmail({
                email: profile.emailAddress
              })"
            >
              {{
                $t("account.settings.unverifiedEmailModal.resend")
              }}
            </button>
          </p>
        </Dialog.Description>

        <div class="modal-button-wrapper">
          <Dialog.Close
            class="cancel"
            :disabled="isLoadingUpdateEmail"
          >
            {{ $t("modals.close") }}
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal><Dialog.Trigger class="unverified">
      {{ $t('account.settings.verify_email') }}
    </Dialog.Trigger>
  </Dialog.Root>
</template>
<style>
.update-trigger {
	all: unset;
	color: var(--accent-shade-1);
	font-weight: bold;
	cursor: pointer;
}
.unverified {
	all: unset;
	color: var(--accent-shade-1);
	font-weight: bold;
	cursor: pointer;
}
.update-trigger:hover,
.unverified:hover {
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
