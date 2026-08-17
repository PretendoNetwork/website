<script setup lang="ts">
import DefaultLayout from './layouts/default.vue';
const { error } = defineProps<{ error: any }>();
</script>

<template>
  <DefaultLayout>
    <div
      v-if="error?.statusCode === 404"
      class="wrapper"
    >
      <h1 class="status">
        {{ error?.statusCode }}
      </h1>
      <p class="description">
        {{ $t('notfound.description') }}
      </p>
      <img
        src="~/assets/images/err_bandwidthlost.png"
        class="bandwidth notfound"
      >
    </div>
    <div
      v-else
      class="wrapper"
    >
      <h1 class="status">
        {{ error?.statusCode }}
      </h1>

      <p class="description">
        {{ $t('errorPage.500.title') }} {{ $t('errorPage.500.description') }}
      </p>

      <img
        src="/assets/images/shockedbandwidth.svg"
        class="bandwidth"
      >
    </div>
  </DefaultLayout>
</template>

<style scoped>
.status {
	font-size: 8rem;
	text-align: center;
	margin: 6rem 0 0;
	color: var(--text-shade-3);
}
.description {
	font-size: 2rem;
	text-align: center;
	color: var(--text-shade-1);
	margin: 0;
}
.bandwidth {
	display: block;
	margin: 4rem auto -120px;

	height: 24rem;
}

.bandwidth.notfound {
	height: 32rem;
	margin-bottom: 4em;
}

@media screen and (min-height: 1100px) {
	.status {
		margin-top: 16rem;
	}
	.bandwidth {
			margin: 16rem auto -120px;
	}
	.bandwidth.bandwidth.notfound {
		margin: 6rem auto 16rem;
	}
}
</style>
