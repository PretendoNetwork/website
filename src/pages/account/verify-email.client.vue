<script setup lang="ts">
import type { ApiAccountEmailVerifyRequest } from '~~/shared/api-types';

const route = useRoute();
const token = route.query.token?.toString() || '';

const success = ref(false);
const errorMessage = ref('');

const {
	execute: executeVerifyEmail,
	isLoading: isLoadingVerifyEmail
} = useAsync({
	async handler() {
		await apiFetch('/api/account/verify-email', {
			method: 'POST',
			body: {
				token: token
			} satisfies ApiAccountEmailVerifyRequest
		});

		success.value = true;
	},
	onError(error) {
		const err = getApiError(error);
		errorMessage.value = err.message;
	}
});

await callOnce(async () => {
	await executeVerifyEmail();
});
</script>

<template>
  <div v-if="isLoadingVerifyEmail">
    <div class="account-form-wrapper">
      <form
        class="account loading"
      >
        <Loader />
      </form>
    </div>
  </div>
  <div v-else-if="success">
    <div class="account-form-wrapper">
      <h1
        class="title dot"
      >
        {{ $t('account.emailVerification.verifiedTitle') }}
      </h1>
      <p>{{ $t('account.emailVerification.verifiedCaption') }}</p>
    </div>
  </div>
  <div v-else>
    <div class="account-form-wrapper">
      <h1 class="title dot">
        {{ $t('account.emailVerification.failedTitle') }}
      </h1>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.account-form-wrapper {
  min-height: 60vh;
  display: flex;
  align-content: center;
  flex-direction: column;
  margin: 15vh auto;
  width: -moz-fit-content;
  width: fit-content;
  overflow: hidden;
}
.title {
	font-size: 4rem;
	margin-bottom: 0;
}
@media screen and (max-width: 1000px) {
	.title {
	font-size: 2rem;
	}
}
</style>
