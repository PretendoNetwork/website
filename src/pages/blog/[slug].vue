<script setup>
const slug = useRoute().params.slug;
const { data: post } = await useAsyncData(`blog-${slug}`, () => {
	return queryCollection('blog').path(`/blog/${slug}`).first();
});

useHead({
	title: `${post.value.title} | Pretendo Network Blog`,
	meta: [
		{ property: 'description', content: post.value.caption },
		{ property: 'og:title', content: `${post.value.title} | Pretendo Network Blog` },
		{ property: 'og:description', content: post.value.caption },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: 'https://pretendo.network/' },
		{ property: 'og:image', content: post.value.cover_image },
		{ property: 'og:image:alt', content: 'Pretendo Network' },
		{ property: 'og:site_name', content: 'Pretendo Network' },
		{ name: 'twitter:url', content: 'https://pretendo.network/' },
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:site', content: '@PretendoNetwork' },
		{ name: 'twitter:title', content: `${post.value.title} | Pretendo Network Blog` },
		{ name: 'twitter:description', content: post.value.caption },
		{ name: 'twitter:image', content: post.value.cover_image }
	]
});
</script>

<template>
  <div class="card-wrap">
    <div class="blog-card">
      <h1 class="title">
        {{ post.title }}
      </h1>

      <div class="pub-info">
        <span>{{ $t('blogPage.published') }}</span>
        <div class="profile">
          <img
            class="profile-picture"
            :src="post.author_image"
            :alt="post.author"
          >
          <span>{{ post.author }}</span>
        </div>
        <span>{{ $t('blogPage.publishedOn') }}
          <span class="date">{{ post.date }}</span>
        </span>
      </div>

      <ContentRenderer :value="post" />
    </div>
  </div>
</template>

<style scoped>
.card-wrap {
	width: 100%;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	margin: 8rem 0;
}

.blog-card {
	padding: 60px;
	border-radius: 10px;
	background: var(--bg-shade-0);
	max-width: 1100px;
	color: var(--text-shade-1);
}

.blog-card :deep(h1),
.blog-card :deep(h2),
.blog-card :deep(h3),
.blog-card :deep(h4),
.blog-card :deep(h5),
.blog-card :deep(h6) {
	margin: 40px 0 10px;
	color: var(--text-shade-3) !important;
}

.blog-card :deep(strong) {
	color: var(--text-shade-3);
}

.blog-card :deep(a), .blog-card :deep(a) * {
	color: inherit;
	text-decoration: none;
}

.blog-card :deep(a:hover), .blog-card :deep(a:hover) * {
	text-decoration: underline;
}

.blog-card :deep(*:not(h1, h2, h3, h4, h5, h6) > a),
.blog-card :deep(*:not(h1, h2, h3, h4, h5, h6) > a) * {
	color: var(--accent-shade-1);
	text-decoration: none;
	font-weight: bold;
}

.blog-card :deep(*:not(h1, h2, h3, h4, h5, h6) > a):hover,
.blog-card :deep(*:not(h1, h2, h3, h4, h5, h6) > a):hover * {
	text-decoration: underline;
}

.blog-card .title {
	margin: 0;
	margin-bottom: 8px;
}

.blog-card .pub-info {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: left;
	margin-top: auto;
	margin-bottom: 30px;
}

.blog-card .pub-info .date {
	font-weight: bold;
	color: var(--text-shade-3);
}

.blog-card .pub-info>* {
	margin-right: 0.5em;
	margin-top: 0.2em;
}

.blog-card .profile {
	display: inline-grid;
	grid-template-columns: 30px auto;
	grid-gap: 10px;
	font-weight: bold;
	color: var(--text-shade-3);
	align-items: center;
	height: 32px;
	margin-right: 0.3em;
}

.blog-card .profile img {
	margin: 0;
	border-radius: 4px;
	border: 1px solid var(--border);
	max-width: 100%;
}

.blog-card p,
.post-info {
	color: var(--text-shade-1);
}

.blog-card :deep(img) {
	max-width: 100%;
	max-height: 800px;
	margin: 10px auto;
	display: block;
	border-radius: 4px;
	border: 1px solid var(--border);
}

.blog-card img.emoji {
	display: inline;
	margin: 0;
	border: none;
}

.blog-card :deep(video) {
	width: 100%;
	border-radius: 4px;
	border: 1px solid var(--border);
}

.blog-card :deep(iframe) {
	width: 100%;
	height: auto;
	aspect-ratio: 16/9;
	border-radius: 4px;
	border: 1px solid var(--border);
}

/* Some twitter iframe specific stuff */
.blog-card .twitter-tweet {
	margin: auto;
}

.blog-card .twitter-tweet iframe {
	border: none;
	/* Fixes the double border */
}

.blog-card :deep(table) {
	border-radius: 4px;
	border-collapse: collapse;
	background: var(--bg-shade-3);
	margin-bottom: 30px;
	overflow: hidden;
}

.blog-card :deep(table) th {
	padding: 8px 12px;
	background: var(--bg-shade-4);
	color: var(--text-shade-3);
}

.blog-card :deep(table) td {
	padding: 8px 12px;
	vertical-align: top;
	border-radius: inherit;
}

.blog-card :deep(table) tr:nth-child(even) {
	background: var(--bg-shade-2);
}

.blog-card :deep(pre code) {
	border-radius: 4px;
	margin-bottom: 30px;
}

.blog-card :deep(input[type="checkbox"]) {
	appearance: none;
	-webkit-appearance: none;
	display: inline-block;
	background: var(--bg-shade-3);
	padding: 12px;
	margin: 4px;
	border-radius: 4px;
	vertical-align: -60%;
}

.blog-card :deep(input[type="checkbox"]):checked {
	content: "checkboxtest";
	background: no-repeat center/contain url(/assets/images/check.svg),
	var(--accent-shade-0);
}

.blog-card :deep(hr) {
	border: 1px solid var(--text-shade-1);
	margin: 30px 0;
}

.blog-card :deep(blockquote) {
	border-left: 2px solid var(--text-shade-1);
	padding: 8px 24px;
	margin: 0;
	margin-bottom: 30px;
}

.blog-card :deep(del) {
	text-decoration: line-through;
}

.blog-card :deep(a > del) {
	text-decoration: line-through;
}

.blog-card :deep(a:hover > del) {
	text-decoration: line-through underline;
}
</style>

<style lang="scss">
@media screen and (min-width: 901px) {
	#root {
		.blog-card :deep(h1),
.blog-card :deep(h2),
.blog-card :deep(h3),
.blog-card :deep(h4),
.blog-card :deep(h5),
.blog-card :deep(h6) {
			scroll-margin-top: 110px;
		}
	}
}

@media screen and (max-width: 800px) {
	#root {
		.blog-card {
			padding: 40px;
		}
	}
}

@media screen and (max-width: 600px) {
	#root {
		.wrapper {
			width: 100%;
		}

		header {
			width: 90%;
			margin: 35px auto;
		}

		.blog-card {
			padding: 40px 5vw;
			border-radius: 0;
			margin-top: 0;
		}

		footer {
			width: 95%;
			margin: auto auto 40px;
		}
	}
}
</style>
