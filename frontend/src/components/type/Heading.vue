<template>
  <h1
    v-if="props.size === 'h1'"
    :class="{ dot: props.dot }"
    class="text-[4rem] text-white font-bold"
  >
    <slot />
  </h1>
  <h2
    v-else-if="props.size === 'h2'"
    :class="{ dot: props.dot }"
    class="text-[3.125rem] text-white font-bold"
  >
    <slot />
  </h2>
</template>

<script setup lang="ts">
interface Props {
  size?: 'h1' | 'h2';
  dot?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  size: 'h1',
  dot: false,
});
</script>

<style scoped>
.dot::after {
  content: '';
  width: 0.6rem;
  height: 0.6rem;
  @apply bg-indigo-500 rounded-full inline-block;
}
</style>
