<script setup lang="ts">
import { FetchError } from 'ofetch';

const route = useRoute();
const redirect = computed(() => route.query.redirect);
const registerURI = computed(() => `/account/register${redirect.value ? `?redirect=${redirect.value}` : ''}`);

const loginForm = reactive({ username: '', password: '' });
const errorMessage = ref<string | null>();

async function loginSubmission() {
	try {
		await $fetch('/api/account/login', {
			method: 'POST',
			body: loginForm
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
        class="account"
        @submit.prevent="loginSubmission"
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
            <!-- TODO: loading state on button. ... style maybe? -->
            {{ $t("account.loginForm.login") }}
          </button>
          <a
            :href="registerURI"
            class="register"
          >{{ $t("account.loginForm.registerPrompt") }}</a>
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
