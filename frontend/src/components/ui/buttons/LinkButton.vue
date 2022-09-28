<template>
  <NuxtLink v-if="!props.external" :class="classes" :to="props.to">
    <slot />
  </NuxtLink>
  <a v-else :class="classes" :href="props.to" :target="props.target">
    <slot />
  </a>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary';
  external?: boolean;
  to?: string;
  target?: '_blank';
}
const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  external: false,
  to: '#',
  target: undefined,
});

const classes = {
  'py-3 px-10 rounded-md transition-[background-color,transform] duration-50 active:scale-105':
    true,
  'bg-accent-900 hover:bg-accent-800 text-white': props.type === 'primary',
};
</script>
