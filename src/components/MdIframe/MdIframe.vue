<script lang="ts" setup>
// eslint-disable-next-line vue/prop-name-casing -- this is gonna be used in markdown
const { videoId } = defineProps({ 'video-id': { type: String, required: true } });
</script>

<template>
  <iframe
    width="560"
    height="315"
    :src="`https://www.youtube-nocookie.com/embed/${videoId}`"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  />
</template>
