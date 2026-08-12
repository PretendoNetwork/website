<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import type { ApiAuthForgotPasswordRequest } from '~~/shared/api-types';

const form = reactive({ emailOrUsername: '' });

const errorMessage = ref<string | null>();
const hcaptcha = ref<VueHcaptcha | null>(null);

// TODO style this entire page
async function submit() {
	try {
		const hCaptchaResponse = hcaptcha.value ? (await hcaptcha.value.executeAsync()).response : null;

		await $fetch('/api/auth/forgot-password', {
			method: 'POST',
			body: {
				emailOrPassword: form.emailOrUsername,
				captchaResponse: hCaptchaResponse ?? undefined
			} satisfies ApiAuthForgotPasswordRequest
		});

		alert('Success - check your inbox');
		await navigateTo('/');
	} catch (error: unknown) {
		if (error === 'challenge-closed') {
			// Thrown if the captcha is closed, can be safely ignored
			return;
		}

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
        class="account register"
        @submit.prevent="submit"
      >
        <h2>Forgot password</h2>
        <div>
          <input
            v-model="form.emailOrUsername"
            type="text"
            required
          >
        </div>
        <vue-hcaptcha
          v-if="$config.public.hcaptchaSiteKey"
          ref="hcaptcha"
          :sitekey="$config.public.hcaptchaSiteKey"
          class="h-captcha"
          theme="dark"
        />
        <div class="buttons">
          <button type="submit">
            Send
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
@import "/assets/css/auth.css";
</style>
