<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import { interopDefault } from 'mlly';
// Nuxt hates commonjs modules. this fixes them
import * as tmcModule from 'text-mask-core';
const { createTextMaskInputElement } = interopDefault(tmcModule);

const query = ref('');
const maskInput = createTextMaskInputElement(undefined);
const mask: Array<RegExp | string> = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
function handleInput(e: InputEvent) {
	const el = e.target as HTMLInputElement;
	maskInput.update(el.value, {
		inputElement: el,
		mask,
		guide: false
	});
	query.value = el.value;
}

const debouncedQuery = refDebounced(query);
const { data: searchResults } = await useAsyncData(
	() => `errorcodes-${debouncedQuery.value}`,
	async () => {
		if (!debouncedQuery.value) {
			return [];
		}
		return await queryCollection('errorcodes')
			.where('stem', 'LIKE', `${debouncedQuery.value}%`)
			.limit(25)
			.all();
	},
	{
		watch: [debouncedQuery]
	}
);
const results = computed(() => searchResults.value ?? []);

customSeoMeta({
	subsection: 'docs',
	title: 'Search',
	description: 'Got an error code? Find solutions here.'
});

definePageMeta({
	layout: 'docs'
});
</script>

<template>
  <div class="content-inner search">
    <div class="purple-card">
      <h1>{{ $t("docs.search.title") }}</h1>
      <p>{{ $t("docs.search.caption") }}</p>
      <label for="errorCode">{{ $t("docs.search.label") }}</label>
      <div class="input-wrapper">
        <input
          id="errorCode"
          :class="{ 'has-match': results.length }"
          placeholder="012-3456"
          @input="handleInput"
        >
        <ul
          v-if="results.length"
          class="matches"
        >
          <li
            v-for="result in results"
            :key="result.code"
          >
            <NuxtLink
              class="match"
              :to="`/docs/error/${result.code}`"
            >
              <span class="code">{{ result.code }}</span><span v-if="result.message">: {{ result.message }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.search .purple-card {
	padding: 36px;
}
.search .purple-card h1 {
	margin-top: 0;
}
.search .purple-card p {
	margin-bottom: 2em;
}
.search .purple-card input::placeholder {
	color: var(--text-shade-0);
}
.search .purple-card input:focus {
	background-color: var(--bg-shade-4);
	color: #fff;
	transition: 200ms;
	outline: none;
}

.search .input-wrapper {
	position: relative;
	margin-top: 8px;
}
.search .input-wrapper .matches {
	display: flex;
	flex-flow: column;
	font-size: 1rem;
	background-color: var(--bg-shade-2);
	border: none;
	border-radius: 0 0 4px 4px;
	margin: 0;
	padding: 0;
	max-height: 204px;
	overflow-y: auto;
	overflow-x: hidden;
	list-style: none;
}
.search .input-wrapper .match {
	display: block;
	padding: 12px;
	color: var(--text-shade-1);
	text-decoration: none;
}

.search .input-wrapper .match .code {
	font-weight: bold;
	color: var(--text-shade-3)
}

.search .input-wrapper .matches a:hover {
	background-color: var(--bg-shade-1);
}
.search input.has-match {
	border-radius: 4px 4px 0 0;
}
</style>
