<script setup lang="ts">
const { t } = useI18n();

const progress = await useFetch('/api/progress');
const projects = computed(() => progress.data.value?.items ?? []);
const donations = computed(() => progress.data.value?.donations);
const goalPercentage = computed(() => Math.floor((donations.value?.currentCents ?? 0) / (donations.value?.goalCents ?? 0) * 100));

const goalTextVars = computed(() => {
	return {
		totd: Math.round((donations.value?.currentCents ?? 0) / 100).toString(),
		goald: Math.round((donations.value?.goalCents ?? 0) / 100).toString(),
		perc: goalPercentage.value.toString()
	};
});
</script>

<template>
  <div>
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
          {{ t('progressPage.title') }}
        </h1>
        <p class="text">
          {{ t('progressPage.description') }}
        </p>
      </div>
    </div>

    <div class="all-progress-lists">
      <div class="donation-progress">
        <h1 class="title dot">
          <span>Donation goal</span>
          <img
            v-if="goalPercentage >= 100"
            :src="'/assets/images/ganon.apng'"
            alt="An animated image of Cucuí Ganon dancing"
            class="cucui-dance"
          >
        </h1>
        <div
          class="progress-bar"
          :style="{
            '--progress-bar-width': goalPercentage + '%',
          }"
        >
          <div
            v-if="goalPercentage >= 100"
            class="progress-bar-real"
          />
          <div class="progress-bar-capped" />
        </div>
        <p class="localeReplace">
          <span
            class="goal-text-content"
          >
            <i18n-t keypath="donation.progress">
              <template #totd>
                <span>${{ goalTextVars.totd }}</span>
              </template>
              <template #goald>
                <span>${{ goalTextVars.goald }}</span>
              </template>
              <template #perc>
                <span>{{ goalTextVars.perc }}%</span>
              </template>
            </i18n-t>
          </span>
          {{ ' ' }}
          <i18n-t keypath="donation.upgradePushText">
            <template #link>
              <a href="/account/upgrade">{{ t('donation.upgradePushLinkText') }}</a>
            </template>
          </i18n-t>
        </p>
      </div>

      <div
        v-if="projects.length > 0"
        id="quick-nav"
      >
        <h1 class="title dot">
          Quick Nav
        </h1>
        <ul>
          <li
            v-for="project of projects"
            :key="project.title"
          >
            <a :href="'#'+slugify(project.title)">{{ project.title }}</a>
          </li>
        </ul>
      </div>
      <br>
      <div
        v-for="project of projects"
        :id="slugify(project.title)"
        :key="project.title"
        class="purple-card"
      >
        <ProgressCard
          show-title
          :item="project"
        />
      </div>
      <p v-if="projects.length === 0">
        No projects
      </p>
    </div>
  </div>
</template>

<style scoped>
.purple-card {
	padding: 50px 20px;
	border-radius: 10px;
	background: var(--bg-shade-0);
}

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
.progress-hero .text a {
	color: var(--accent-shade-1);
	text-decoration: none;
	font-weight: bold;
}
.progress-hero .text a:hover {
	text-decoration: underline;
}

.hero-meta {
	margin-top: 25vh;
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
.hero-image {
	position: relative;
	height: 100%;
}

.progress-bar {
	position: relative;
	display: block;
	width: 100%;
	height: 12px;
	margin: 1rem 0;
	border-radius: 6px;
	background: var(--bg-shade-3);
}
.progress-bar-real,
.progress-bar-capped {
	position: absolute;
	height: 100%;
	border-radius: 6px;
	width: var(--progress-bar-width);
}
.progress-bar-capped {
	background-color: var(--accent-shade-0);
	max-width: 100%;
}
.progress-bar-real {
	background-color: var(--green-shade-1);
	width: calc(var(--progress-bar-width) - 6px);
	left: 6px;
}

.donation-progress {
	padding: 72px 72px;
  border-radius: 10px;
  background: var(--bg-shade-0);
	grid-column: span 2;
}
.donation-progress h1 {
	display: inline-block;
	margin: 0;
}
.donation-progress .goal-text-content :deep(span) {
	font-weight: bold;
}
.donation-progress :deep(a) {
	color: var(--accent-shade-1);
	text-decoration: none;
	font-weight: bold;
}
.donation-progress :deep(a:hover) {
	text-decoration: underline;
}

.donation-progress .cucui-dance {
	height: 2em;
	margin-bottom: -0.6em;
}

.all-progress-lists {
	margin-top: 50px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 20px;
}
.feature-list-wrapper {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-gap: 20px;
	margin-top: 22px;
}
.feature-progress-chart {
	max-width: 100px;
}
.feature-progress-chart canvas.percentage-chart {
	pointer-events: none; /* Fixes issue #48 */
}
.feature-list-wrapper h3 {
	margin: 0;
}
.feature-list-wrapper hr {
	border: 0;
	width: 100%;
	height: 1px;
	margin: 20px 0;
	background: rgba(255, 255, 255, 0.1);
}
.progress-title {
	margin-bottom: 20px;
}
.progress-title a.github {
	margin-top: 10px;
	color: var(--text-shade-0);
	display: inline-flex;
	align-items: center;
	opacity: .75;
	text-decoration: none;
	transition: color 50ms ease-in-out;
}
.progress-title a.github:focus, .progress-title a.github:hover, .progress-title a.github:visited {
	color: var(--text-shade-0);
	text-decoration: none;
}
.progress-title a.github:hover {
	opacity: 1;
}
.progress-title a.github svg {
	height: 1.3rem;
	margin-right: .4rem;
}
.feature-list-wrapper.purple .progress-title a.github, .feature-list-wrapper.purple .progress-title a.github:focus, .feature-list-wrapper.purple .progress-title a.github:hover, .feature-list-wrapper.purple .progress-title a.github:visited {
	color: var(--accent-shade-3);
}
.feature-list-wrapper .core > .progress-title a.github:hover {
	color: white;
}

.feature-list-wrapper canvas {
	width: 100px;
	height: 100px;
}

.feature-progress-chart {
	position: relative;
}
.feature-progress-chart p {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	margin: 0;
	font-weight: bolder;
	font-size: 1.3rem;
}

/* Progress: Feature list */
.feature-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	grid-gap: 10px;
}
.feature {
	display: grid;
	align-items: flex-start;
	grid-template-columns: auto 1fr;
	grid-gap: 10px;
}

/* Custom checkboxes */
.custom-checkbox {
	width: 1.5rem;
	height: 1.5rem;
	background: var(--bg-shade-3);
	color: var(--text-shade-3);
	border-radius: 2px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.custom-checkbox.done {
	background: #50AC75;
}
.custom-checkbox.ongoing {
	background: #DBAC5B;
}
.custom-checkbox svg {
	width: 100%;
	height: 100%;
}
.custom-checkbox .small-dot {
	width: 0.5rem;
	height: 0.5rem;
	background: white;
	border-radius: 50%;
}

#quick-nav a {
	color: var(--text-shade-1);
	text-decoration: none;
	width: fit-content;
}

#quick-nav a:hover {
	color: var(--text-shade-3);
	text-decoration: underline;
}
</style>
