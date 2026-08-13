<script setup lang="ts">
import { TransitionPresets, useElementVisibility, useTransition } from '@vueuse/core';
import type { ProgressItem } from '~~/shared/api-types';
const { t } = useI18n();

const props = defineProps<{
	purple?: boolean;
	showTitle?: boolean;
	item: ProgressItem;
}>();

const chartRef = useTemplateRef('chart');
const targetIsVisible = useElementVisibility(chartRef, {
	once: true
});
const currentlyVisiblePercentage = computed(() => targetIsVisible.value ? props.item.completion : 0);
const animatedPercentage = useTransition(currentlyVisiblePercentage, {
	duration: 2000,
	easing: TransitionPresets.easeInOutQuad
});

const completedTasks = computed(() => props.item.tasks.filter(v => v.status === 'completed'));
const inProgressTasks = computed(() => props.item.tasks.filter(v => v.status === 'inprogress'));
const notStartedTasks = computed(() => props.item.tasks.filter(v => v.status === 'notstarted'));
</script>

<template>
  <div
    class="feature-list-wrapper"
    :class="{ 'purple': props.purple }"
  >
    <div class="feature-list-top">
      <div>
        <div class="feature-progress-chart">
          <p class="percentage-label">
            {{ Math.floor(animatedPercentage) }}%
          </p>
          <svg
            ref="chart"
            class="percentage-svg"
            viewBox="-25 -25 250 250"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              r="100"
              cx="100"
              cy="100"
              fill="transparent"
              stroke="var(--progress-ring-bg)"
              stroke-width="35px"
            />
            <circle
              r="100"
              cx="100"
              cy="100"
              pathLength="100"
              stroke="var(--progress-ring-selected)"
              stroke-width="35px"
              stroke-dashoffset="-75"
              fill="transparent"
              :stroke-dasharray="`${animatedPercentage} ${100-animatedPercentage}`"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="core">
      <div
        v-if="props.showTitle"
        class="progress-title"
      >
        <h3>{{ props.item.title }}</h3>
        <div>
          <a
            v-if="props.item.githubUrl"
            :href="props.item.githubUrl"
            class="github"
            target="_blank"
          >
            <svg
              data-prefix="fab"
              data-icon="github"
              class="svg-inline--fa fa-github fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
            >
              <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              />
            </svg>
            <span>{{ t('progress.githubRepo') }}</span>
          </a>
        </div>
      </div>
      <div class="feature-list">
        <div
          v-for="task of completedTasks"
          :key="task.title"
          class="feature"
        >
          <div class="custom-checkbox done">
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
              class="feather feather-check"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span>{{ task.title }}</span>
        </div>

        <div
          v-for="task of inProgressTasks"
          :key="task.title"
          class="feature"
        >
          <div class="custom-checkbox ongoing">
            <div class="small-dot" />
          </div>
          <span>{{ task.title }}</span>
        </div>

        <div
          v-for="task of notStartedTasks"
          :key="task.title"
          class="feature"
        >
          <div class="custom-checkbox incomplete" />
          <span>{{ task.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.feature-progress-chart {
	position: relative;
}
.feature-progress-chart p {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -59%);
	margin: 0;
	font-weight: bolder;
	font-size: 1.1rem;
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

.percentage-svg {
	height: 100px;
	width: 100px;

	--progress-ring-bg: #31365A;
	--progress-ring-selected: #9D6FF3;
}
.purple .percentage-svg {
	--progress-ring-bg: rgba(195, 178, 227, 0.5);
	--progress-ring-selected: white;
}
</style>
