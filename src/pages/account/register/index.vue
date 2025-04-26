<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { FetchError } from 'ofetch';

const route = useRoute();
const redirect = computed(() => route.query.redirect);
const loginURI = computed(() => `/account/login${redirect.value ? `?redirect=${redirect.value}` : ''}`);

const registerForm = reactive({ email: '', username: '', mii_name: '', password: '', password_confirm: '' });

const errorMessage = ref<string | null>();
const invisibleHcaptcha = ref<VueHcaptcha | null>(null);

async function registerSubmission() {
	try {
		const hCaptchaResponse = invisibleHcaptcha.value ? (await invisibleHcaptcha.value.executeAsync()).response : null;

		await $fetch('/api/account/register', {
			method: 'POST',
			body: { ...registerForm, hCaptchaResponse }
		});

		if (typeof redirect.value === 'string') {
			await navigateTo(redirect.value);
		} else {
			await navigateTo('/account');
		}
	} catch (error: unknown) {
		if (error instanceof FetchError) {
			errorMessage.value = error.statusText;
		} else {
			if (error === 'challenge-closed') { // Thrown if the captcha is closed, can be safely ignored
				return;
			}

			errorMessage.value = `Error during registration: ${error}`; // TODO: localize
		}

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
        @submit.prevent="registerSubmission"
      >
        <h2>{{ $t("account.loginForm.register") }}</h2>
        <p>{{ $t("account.loginForm.detailsPrompt") }}</p>
        <div class="email">
          <label for="email">{{ $t("account.loginForm.email") }}</label>
          <input
            id="email"
            v-model="registerForm.email"
            name="email"
            type="email"
            required
          >
        </div>
        <div>
          <label for="username">{{ $t("account.loginForm.username") }}</label>
          <input
            id="username"
            v-model="registerForm.username"
            name="username"
            minlength="6"
            maxlength="16"
            required
          >
        </div>
        <div>
          <label for="mii_name">{{ $t("account.loginForm.miiName") }}</label>
          <input
            id="mii_name"
            v-model="registerForm.mii_name"
            name="mii_name"
            maxlength="10"
            required
          >
        </div>
        <div>
          <label for="password">{{ $t("account.loginForm.password") }}</label>
          <input
            id="password"
            v-model="registerForm.password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
          >
        </div>
        <div>
          <label for="password_confirm">{{ $t("account.loginForm.confirmPassword") }}</label>
          <input
            id="password_confirm"
            v-model="registerForm.password_confirm"
            name="password_confirm"
            type="password"
            autocomplete="new-password"
            required
          >
        </div>
        <div class="buttons">
          <button type="submit">
            {{ $t("account.loginForm.register") }}
          </button>
          <a
            :href="loginURI"
            class="register"
          >{{ $t("account.loginForm.loginPrompt") }}</a>
        </div>
      </form>
    </div>
    <vue-hcaptcha
      v-if="$config.public.hCaptchaSitekey"
      ref="invisibleHcaptcha"
      :sitekey="$config.public.hCaptchaSitekey"
      class="h-captcha"
      size="invisible"
    />
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
