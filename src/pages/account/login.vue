<script setup lang="ts">
const route = useRoute();
const auth = useAuthStore();
const authUtils = useAuthUtils();
const toasts = useToasts();
const redirect = computed(() => route.query.redirect?.toString() ?? null);
const registerURI = computed(() => {
	if (redirect.value) {
		const params = new URLSearchParams({
			redirect: redirect.value
		});
		return `/account/register?${params}`;
	}
	return `/account/register`;
});

const loginForm = reactive({ username: '', password: '' });

const { execute, isLoading } = useAsync({
	async handler() {
		const res = await $fetch('/api/auth/login', {
			method: 'POST',
			body: {
				username: loginForm.username,
				password: loginForm.password
			}
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
        class="account"
        @submit.prevent="execute"
      >
        <h2>{{ $t("account.loginForm.login") }}</h2>
        <p>{{ $t("account.loginForm.detailsPrompt") }}</p>
        <div>
          <label for="username">{{ $t("account.loginForm.username") }}</label>
          <input
            id="username"
            v-model="loginForm.username"
            name="username"
            required
          >
        </div>
        <div>
          <label for="password">{{ $t("account.loginForm.password") }}</label>
          <input
            id="password"
            v-model="loginForm.password"
            name="password"
            type="password"
            required
          >
          <a
            href="/account/forgot-password"
            class="pwdreset"
          >{{ $t("account.loginForm.forgotPassword") }}</a>
        </div>
        <div class="buttons">
          <button type="submit">
            <Loader v-if="isLoading" />
            <span v-else>{{ $t("account.loginForm.login") }}</span>
          </button>
          <a
            :href="registerURI"
            class="register"
          >{{ $t("account.loginForm.registerPrompt") }}</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/auth.css";
</style>
