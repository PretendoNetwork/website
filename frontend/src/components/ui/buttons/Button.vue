<template>
  <button :class="classes">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary';
}
const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
});

const classes = {
  'py-3 px-10 rounded-md transition-[background-color,transform] duration-50 active:scale-105':
    true,
  'bg-accent-900 hover:bg-accent-800 text-white': props.type === 'primary',
};
</script>
