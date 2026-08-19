<script setup lang="ts">
useHead({
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | Pretendo Network` : 'Pretendo Network';
	}
});
</script>

<template>
  <div
    id="root"
    class="main-body"
  >
    <ToastRenderer />
    <Navbar />
    <div class="wrapper">
      <slot />
      <Footer />
    </div>
  </div>
</template>
