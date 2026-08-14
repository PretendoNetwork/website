<script setup lang="ts">
const { te, t, tm } = useI18n();

useHead({
	title: 'Install',
	meta: [
		{
			name: 'description',
			content:
				'Learn how to set up Pretendo on a variety of consoles and emulators.'
		},
		{
			name: 'og:description',
			content:
				'Learn how to set up Pretendo on a variety of consoles and emulators.'
		},
		{
			name: 'twitter:description',
			content:
				'Learn how to set up Pretendo on a variety of consoles and emulators.'
		}
	]
});

definePageMeta({
	layout: 'docs'
});
</script>

<template>
  <div class="content-inner">
    <h1>Installation</h1>
    <p>Please choose your platform below.</p>
    <div class="platform-grid">
      <a href="/docs/install/wiiu">
        <img
          src="/assets/images/docs/install/icons/wiiu-gamepad.svg"
          alt="Illustration of a Wii U Gamepad"
        >
        <span>Wii U</span>
      </a>
      <a href="/docs/install/3ds">
        <img
          src="/assets/images/docs/install/icons/2ds.svg"
          alt="Illustration of a New Nintendo 2DS XL"
        >
        <span>3DS Family</span>
      </a>
      <a href="/docs/install/cemu">
        <img
          src="/assets/images/docs/install/icons/cemu.svg"
          alt="Cemu logo"
        >
        <span>Cemu</span>
      </a>
      <a href="/docs/install/azahar">
        <img
          src="/assets/images/docs/install/icons/azahar.svg"
          alt="Azahar logo"
        >
        <span>Azahar</span>
      </a>
      <a href="/docs/install/citra">
        <img
          src="/assets/images/docs/install/icons/citra.svg"
          alt="Citra logo"
        >
        <span>Citra</span>
      </a>
    </div>
  </div>
</template>
