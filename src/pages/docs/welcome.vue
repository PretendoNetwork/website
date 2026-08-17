<script setup lang="ts">

useHead({
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
    <h1>{{ $t('docs.quickLinks.header') }}</h1>
    <div class="quick-links-grid">
      <a href="/docs/install">
        <Icon
          name="ph:download-simple"
          size="32"
          mode="svg"
        />
        <div>
          <p class="header">{{ $t('docs.quickLinks.links[0].header') }}</p>
          <p>{{ $t('docs.quickLinks.links[0].caption') }}</p>
        </div>
        <Icon
          name="ph:caret-right"
          size="32"
          mode="svg"
        />
      </a>

      <a href="/docs/errors">
        <Icon
          name="ph:magnifying-glass"
          size="32"
          mode="svg"
        />
        <div>
          <p class="header">{{ $t('docs.quickLinks.links[1].header') }}</p>
          <p>{{ $t('docs.quickLinks.links[1].caption') }}</p>
        </div>
        <Icon
          name="ph:caret-right"
          size="32"
          mode="svg"
        />
      </a>
    </div>

    <h1>Welcome</h1>
    <p>
      Welcome to the official documentation for Pretendo Network. Here you'll be able to find installation instructions, error
      codes, and more.
    </p>
    <p>To begin, check out the quick links or take a look at the sidebar</p>
  </div>
</template>
