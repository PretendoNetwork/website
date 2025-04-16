<script lang="ts" setup>
const props = defineProps<{
	videoId: string;
}>();
</script>

<template>
  <iframe
    width="560"
    height="315"
    :src="`https://www.youtube-nocookie.com/embed/${props.videoId}`"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  />
</template>
