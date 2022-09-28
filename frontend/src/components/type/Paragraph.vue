<template>
  <p
    :class="{
      'text-purple-100': props.color === 'purple',
    }"
    class="leading-relaxed"
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
interface Props {
  color?: 'purple';
}
const props = withDefaults(defineProps<Props>(), {
  color: 'purple',
});
</script>
