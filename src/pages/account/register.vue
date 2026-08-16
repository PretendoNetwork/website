<script setup lang="ts">
import type { ApiAuthRegisterRequest } from '~~/shared/api-types';

const route = useRoute();
const auth = useAuthStore();
const authUtils = useAuthUtils();
const toasts = useToasts();
const redirect = computed(() => route.query.redirect?.toString() ?? null);
const loginURI = computed(() => {
	if (redirect.value) {
		const params = new URLSearchParams({
			redirect: redirect.value
		});
		return `/account/login?${params}`;
	}
	return `/account/login`;
});

const registerForm = reactive({ email: '', username: '', mii_name: '', password: '', password_confirm: '' });
const captchaRef = useTemplateRef('captcha');

const { execute, isLoading } = useAsync({
	async handler() {
		let captchaResponse: string | null = null;
		if (captchaRef.value) {
			captchaResponse = await captchaRef.value.getToken();
			if (!captchaResponse) {
				return;
			}
		}

		const res = await $fetch('/api/auth/register', {
			method: 'POST',
			body: {
				email: registerForm.email,
				miiName: registerForm.mii_name,
				password: registerForm.password,
				username: registerForm.username,
				captchaResponse: captchaResponse ?? undefined
			} satisfies ApiAuthRegisterRequest
		});
		auth.set({
			accessToken: res.accessToken,
			refreshToken: res.refreshToken
		});
		await authUtils.safelyRedirectAfterLogin(redirect.value);
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
        class="account register"
        @submit.prevent="execute"
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
            passwordrules="minlength: 6; maxlength: 16; max-consecutive: 2; allowed: [-!-~];"
            pattern="[-!-~]{6,16}"
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
        <Captcha
          v-if="$config.public.hcaptchaSiteKey"
          ref="captcha"
          class="h-captcha"
          :site-key="$config.public.hcaptchaSiteKey"
          theme="dark"
        />
        <div class="buttons">
          <button type="submit">
            <Loader v-if="isLoading" />
            <span v-else>{{ $t("account.loginForm.register") }}</span>
          </button>
          <a
            :href="loginURI"
            class="register"
          >{{ $t("account.loginForm.loginPrompt") }}</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import "/assets/css/auth.css";
</style>
