<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

const props = defineProps<{
	siteKey: string;
	theme?: string;
}>();

const captchaEl = useTemplateRef('hcaptcha');
const hcaptchaToken = ref<string | null>(null);

async function getToken(): Promise<string | null> {
	// Already has a non-expired token
	if (hcaptchaToken.value) {
		return hcaptchaToken.value;
	}

	if (!captchaEl.value) {
		return null;
	}

	try {
		const response = await captchaEl.value.executeAsync();
		return response.response;
	} catch (err) {
		console.error('Failed to execute captcha', err);
		return null;
	}
}

defineExpose({
	getToken
});
</script>

<template>
  <div>
    <VueHcaptcha
      ref="hcaptcha"
      :sitekey="props.siteKey"
      :theme="props.theme"
      @verify="(token: string) => (hcaptchaToken = token)"
      @expire="hcaptchaToken = null"
    />
  </div>
</template>
