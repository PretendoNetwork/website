<script setup lang="ts">
/* eslint-disable vue/no-v-html -- we might wanna avoid this by rewriting the locales to use variables */
const { data: allPosts } = await useAsyncData('blog', () => queryCollection('blog').all());

const posts = allPosts.value?.filter(p => !p.path.startsWith('/blog/_')).sort((a, b) => {
	return new Date(b.date).getTime() - new Date(a.date).getTime();
});
</script>

<template>
  <div class="blog">
    <div class="progress-hero">
      <div class="hero-meta reduced-margin">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48.87"
          height="71.093"
          viewBox="0 0 48.87 71.093"
        >
          <g
            id="XMLID_6_"
            transform="translate(0)"
          >
            <path
              id="XMLID_15_"
              d="M69.581,29.593c-2.029,1.068-.249,4.129,1.78,3.061,5.162-2.67,11.463-2.6,16.981-1.1,4.735,1.282,9.5,3.845,12.246,8.045,1.246,1.922,4.307.142,3.061-1.78C96.921,27.386,80.3,24.04,69.581,29.593Z"
              transform="translate(-60.112 -20.086)"
              fill="#9d6ff3"
            />
            <path
              id="XMLID_14_"
              d="M103.359,21.045c-3.951-6.159-10.751-10-17.657-11.89C77.763,6.948,68.721,7.019,61.281,10.9c-2.029,1.068-.249,4.129,1.78,3.061,6.586-3.453,14.667-3.311,21.644-1.388,5.981,1.638,12.1,4.913,15.521,10.252C101.507,24.783,104.569,23,103.359,21.045Z"
              transform="translate(-54.766 -7.693)"
              fill="#9d6ff3"
            />
            <path
              id="XMLID_9_"
              d="M65.995,47.8a20.7,20.7,0,0,0-12.958,4.45H47.27a2.579,2.579,0,0,0-2.67,2.456v47.239a2.763,2.763,0,0,0,2.67,2.67h5.838a2.639,2.639,0,0,0,2.528-2.67V87.564A21.228,21.228,0,1,0,65.995,47.8Zm0,33.178a12,12,0,1,1,12-12A12,12,0,0,1,65.995,80.978Z"
              transform="translate(-44.6 -33.522)"
              fill="#9d6ff3"
            />
          </g>
        </svg>
        <h1 class="title dot">
          {{ $t('blogPage.title') }}
        </h1>
        <p
          class="text"
          v-html="$t('blogPage.description')"
        />
      </div>
    </div>

    <a
      v-for="post in posts"
      :key="post.id"
      :href="post.path"
      class="purple-card blog-card"
    >
      <div class="post-info">
        <h2 class="title">{{ post.title }}</h2>
        <p class="caption">{{ post.caption }}</p>
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
      </div>
      <div
        class="cover"
        :style="{ 'background': `no-repeat center/cover url(${post.cover_image})` }"
      />
    </a>

    <div class="buttons">
      <!-- TODO: implement pagination -->
      <a
        href="/blog/feed.xml"
        target="_blank"
        title="RSS feed"
      >
        <button class="button secondary icon-btn">
          <Icon
            name="ph:rss"
            size="36"
          />
        </button>
      </a>
    </div>
  </div>
</template>

<style scoped>
.progress-hero {
	width: 100%;
	display: flex;
	justify-items: center;
	align-items: center;
	text-align: center;
}
.progress-hero svg {
	width: 3rem;
	height: 3rem;
}
.progress-hero .text {
	max-width: 423px;
	color: var(--text-shade-1);
	line-height: 1.8;
}
.progress-hero .text :deep(a) {
	color: var(--accent-shade-1);
	text-decoration: none;
	font-weight: bold;
}
.progress-hero .text :deep(a):hover {
	text-decoration: underline;
}

.hero-meta.reduced-margin {
	margin: 10vh 0;
	width: 100%;
}
.hero-meta.reduced-margin h1 {
	width: 100%;
}
.hero-meta.reduced-margin p {
	margin: 0 auto;
}

.blog-card {
	display: flex;
	flex-flow: row nowrap;
	padding: 0;
	margin: 0 auto;
	max-width: 1000px;
	margin-bottom: 30px;
	text-decoration: none;
	position: relative;
	border-radius: 10px;
	overflow: hidden;
	background: var(--bg-shade-0);
}

.blog-card .post-info {
	flex: 50%;
	padding: 40px;
	display: flex;
	flex-flow: column;
	color: var(--text-shade-1);
}

.blog-card .post-info .title {
	color: var(--text-shade-3);
	margin: 0;
}

.blog-card .post-info .caption {
	margin: 4px 0 32px 0;
}

.blog-card .pub-info {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: left;
	margin-top: auto;
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
	border-radius: 4px;
	border: 1px solid var(--border);
	max-width: 100%;
}

.blog-card .cover {
	flex: 50%;
	border: 3px solid var(--bg-shade-0);
	border-radius: 0 10px 10px 0;
}

.progress-hero a,
.progress-hero a * {
	color: var(--accent-shade-1);
	text-decoration: none;
	font-weight: bold;
}

.progress-hero a:hover,
.progress-hero a:hover {
	text-decoration: underline;
}

.buttons {
	margin: 10vh auto;
	width: min-content;
}

.buttons button.secondary.icon-btn {
	cursor: pointer;
	width: 48px;
	height: 48px;
	padding: 0;
}

footer {
	margin-top: 160px;
}
</style>

<style lang="scss">
@media screen and (max-width: 900px) {
	#root {
		.blog-card {
			flex-flow: column;
		}

		.blog-card .post-info {
			padding: 30px;
		}

		.blog-card .cover {
			order: -1;
			min-height: 250px;
			border-radius: 10px 10px 0 0;
		}

		footer {
			margin-top: 100px;
		}
	}
}

@media screen and (max-width: 450px) {
	#root {
		.blog-card .cover {
			min-height: 200px;
		}
	}
}
</style>
