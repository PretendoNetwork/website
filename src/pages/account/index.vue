<script setup lang="ts">
definePageMeta({
	needsAuth: true,
})

const me = useMeStore();
</script>


<template>
  <div>
		<h1>Hello {{ me.user?.username }}</h1>
    <p>TODO: account stub page</p>
  </div>
</template>
