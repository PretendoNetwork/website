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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-download"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line
            x1="12"
            y1="15"
            x2="12"
            y2="3"
          />
        </svg>
        <div>
          <p class="header">{{ $t('docs.quickLinks.links[0].header') }}</p>
          <p>{{ $t('docs.quickLinks.links[0].caption') }}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-chevron-right"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </a>

      <a href="/docs/errors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-search"
        >
          <circle
            cx="11"
            cy="11"
            r="8"
          />
          <line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
          />
        </svg>
        <div>
          <p class="header">{{ $t('docs.quickLinks.links[1].header') }}</p>
          <p>{{ $t('docs.quickLinks.links[1].caption') }}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-chevron-right"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
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
