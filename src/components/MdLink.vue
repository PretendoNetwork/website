<script lang="ts" setup>
function fixFragmentLinks(e: MouseEvent) {
	const targetEl = e.target as HTMLAnchorElement;
	const to = targetEl?.getAttribute('href');

	if (targetEl?.tagName !== 'A' || !to?.startsWith('#')) {
		return;
	}

	e.preventDefault();
	document.getElementById(to.slice(1))?.scrollTo();
}
</script>

<template>
  <NuxtLink @click="fixFragmentLinks">
    <slot />
  </NuxtLink>
</template>
