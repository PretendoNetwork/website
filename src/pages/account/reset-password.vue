<script setup lang="ts">
import type { ApiAuthResetPasswordRequest } from '~~/shared/api-types';

const route = useRoute();
const { t } = useI18n();
const form = reactive({ password: '', passwordConfirm: '' });
const errorMessage = ref<string | null>();

async function submit() {
	const resetToken = route.query.token?.toString();
	try {
		if (!resetToken) {
			throw new Error('No reset token provided');
		}
		await $fetch('/api/auth/reset-password', {
			method: 'POST',
			body: {
				password: form.password,
				passwordConfirm: form.passwordConfirm,
				resetToken
			} satisfies ApiAuthResetPasswordRequest
		});
		await navigateTo('/account');
	} catch (error: unknown) {
		const err = getApiError(error);
		errorMessage.value = err.code;
		setTimeout(() => { // TODO: replace this toast
			errorMessage.value = null;
		}, 5000);
	}
}
</script>

<template>
  <div>
    <div class="account-form-wrapper">
      <form
        class="account"
        @submit.prevent="submit"
      >
        <h2>{{ t('account.resetPassword.header') }}</h2>
        <p>{{ t('account.resetPassword.sub') }}</p>
        <div>
          <label for="password">{{ t('account.resetPassword.password') }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            name="password"
            autocomplete="new-password"
          >
        </div>
        <div>
          <label for="password_confirm">{{ t('account.resetPassword.confirmPassword') }}</label>
          <input
            id="password_confirm"
            v-model="form.passwordConfirm"
            name="password_confirm"
            type="password"
            autocomplete="new-password"
            required
          >
        </div>
        <div class="buttons">
          <button type="submit">
            {{ t('account.resetPassword.submit') }}
          </button>
        </div>
      </form>
    </div>
    <div
      v-if="errorMessage"
      class="banner-notice error"
    >
      <div>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/auth.css";
</style>
