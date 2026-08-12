<script setup lang="ts">
import type { ApiAuthResetPasswordRequest } from '~~/shared/api-types';

const route = useRoute();
const form = reactive({ password: '', passwordConfirm: '' });
const errorMessage = ref<string | null>();

// TODO style this entire page
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

		alert('Success - your password has been changed');
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
        class="account register"
        @submit.prevent="submit"
      >
        <h2>Change password</h2>
        <div>
          <label>Password</label>
          <input
            v-model="form.password"
            type="text"
            required
          >
        </div>
        <div>
          <label>Confirm password</label>
          <input
            v-model="form.passwordConfirm"
            type="text"
            required
          >
        </div>
        <div class="buttons">
          <button type="submit">
            Submit
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
