<script setup lang="ts">
import type { ApiAuthForgotPasswordRequest } from '~~/shared/api-types';

const { t } = useI18n();

const form = reactive({ emailOrUsername: '' });

const errorMessage = ref<string | null>();
const successMessage = ref<string | null>();
const captchaRef = useTemplateRef('captcha');

async function submit() {
	errorMessage.value = null;
	successMessage.value = null;
	try {
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

		// Success
		form.emailOrUsername = '';
		successMessage.value = 'An email has been sent.';
		setTimeout(() => {
			successMessage.value = null;
		}, 5000);
	} catch (error: unknown) {
		const err = getApiError(error);
		errorMessage.value = err.code;
		setTimeout(() => {
			errorMessage.value = null;
		}, 5000);
	}
}
</script>

<template>
  <div>
    <div class="account-form-wrapper">
      <form
        class="account forgot-password"
        @submit.prevent="submit"
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
    <div
      v-if="successMessage"
      class="banner-notice success"
    >
      <div>
        <p>{{ successMessage }}</p>
      </div>
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
@import "~/assets/css/forgot-password.css";
</style>
