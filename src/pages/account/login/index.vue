<script setup lang="ts">
import { FetchError } from 'ofetch';

const route = useRoute();
const redirect = route.query.redirect;
const registerURI = `/account/register${redirect ? `?redirect=${redirect}` : ''}`;

const loginForm = reactive({ username: null, password: null });
const errorMessage = ref<string | null>();

async function loginSubmission() {
	await $fetch('/api/account/login', {
		method: 'POST',
		body: loginForm
	}).catch((error: FetchError) => {
		errorMessage.value = error.statusText;
		setTimeout(() => { // TODO: this is not the best way to clear this out, but this is temporary! replace all toasts with input alerts in the future
			errorMessage.value = null;
		}, 5000);

		return;
	});

	if (typeof redirect === 'string') {
		await navigateTo(redirect);
	} else {
		await navigateTo('/account');
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
        <input
          id="redirect"
          name="redirect"
          type="hidden"
          :value="redirect"
        >
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
header {
	margin: 35px 0;
}

.account-form-wrapper {
	height: 75vh;
	display: flex;
	justify-content: center;
	align-content: center;
	flex-direction: column;
	margin: auto;
	width: fit-content;
	overflow: hidden;
}

form.account {
	height: fit-content;
	display: block;
	padding: 40px 48px;
	background-color: var(--bg-shade-2);
	color: var(--text-shade-1);
	border-radius: 12px;
	width: min(480px, 90vw);
	box-sizing: border-box;
}

form.account h2 {
	margin: 0;
	color: var(--text-shade-3);
}

form.account p {
	margin: 12px 0;
}

form.account div {
	margin-top: 24px;
}

form.account label {
	display: block;
	margin-bottom: 6px;
	text-transform: uppercase;
	font-size: 12px;
}

form.account button {
	width: 100%;
	background: var(--accent-shade-0);
}

form.account a {
	text-decoration: none;
	display: block;
	color: var(--text-shade-1);
	text-align: right;
	margin: 6px 0;
	width: fit-content;
}

form.account a:hover {
	color: var(--text-shade-3);
}

form.account a.pwdreset {
	margin-left: auto;
	font-size: 14px;
}

form.account a.register {
	margin: auto;
	margin-top: 18px;
}

@keyframes banner-notice {
	0% {
		top: -150px;
	}

	20% {
		top: 35px;
	}

	80% {
		top: 35px;
	}

	100% {
		top: -150px;
	}
}

.banner-notice {
	display: flex;
	justify-content: center;
	position: absolute;
	left: 0;
	top: -150px;
	width: 100%;
	animation: banner-notice 5s;
}

.banner-notice div {
	padding: 4px 36px;
	border-radius: 5px;
	z-index: 3;
}

.banner-notice.error div {
	background: var(--red-shade-1);
}

form.account.register {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	width: min(780px, 90vw);
	column-gap: 24px;
	margin-bottom: 48px;
}

form.account.register div.h-captcha {
	grid-column: 1 / span 2;
	display: flex;
	justify-content: center;
}

form.account.register p,
form.account.register div.email,
form.account.register div.buttons {
	grid-column: 1 / span 2;
}
</style>

<style lang="scss">
@media screen and (max-width: 720px) {
	form.account.register {
		grid-template-columns: 1fr;
	}

	form.account.register div.h-captcha,
	form.account.register p,
	form.account.register div.email,
	form.account.register div.buttons {
		grid-column: unset;
	}
}
</style>
