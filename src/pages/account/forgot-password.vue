<script setup lang="ts">
import type { ApiAuthForgotPasswordRequest } from '~~/shared/api-types';

const { t } = useI18n();
const toasts = useToasts();
const captchaRef = useTemplateRef('captcha');

const form = reactive({ emailOrUsername: '' });

const { execute } = useAsync({
	async handler() {
		let captchaResponse: string | null = null;
		if (captchaRef.value) {
			captchaResponse = await captchaRef.value.getToken();
			if (!captchaResponse) {
				return;
			}
		}

		await $fetch('/api/auth/forgot-password', {
			method: 'POST',
			body: {
				emailOrPassword: form.emailOrUsername,
				captchaResponse: captchaResponse ?? undefined
			} satisfies ApiAuthForgotPasswordRequest
		});
	},
	onSuccess() {
		toasts.publish({
			type: 'success',
			text: 'An email has been sent.'
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
  <div>
    <div class="account-form-wrapper">
      <form
        class="account forgot-password"
        @submit.prevent="execute"
      >
        <h2>{{ t('account.forgotPassword.header') }}</h2>
        <p>{{ t('account.forgotPassword.sub') }}</p>
        <div>
          <label for="input">{{ t('account.forgotPassword.input') }}</label>
          <input
            id="input"
            v-model="form.emailOrUsername"
            type="text"
            required
          >
        </div>
        <Captcha
          v-if="$config.public.hcaptchaSiteKey"
          ref="captcha"
          class="h-captcha"
          :site-key="$config.public.hcaptchaSiteKey"
          theme="dark"
        />
        <div class="buttons">
          <button type="submit">
            {{ t('account.forgotPassword.submit') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/auth.css";
</style>
