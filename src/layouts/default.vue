<script setup lang="ts">
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
