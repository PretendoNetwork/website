<script setup lang="ts">
const progress = await useFetch('/api/progress');
const projects = computed(() => progress.data.value?.items ?? []);
const donations = computed(() => progress.data.value?.donations);
</script>

<template>
  <div>
    <p>TODO: progress stub page</p>
    <h1 v-if="donations">
      {{ donations.currentCents }}¢ / {{ donations.goalCents }}¢
    </h1>
    <div
      v-for="project of projects"
      :key="project.title"
    >
      <h1>{{ project.title }} ({{ project.completion }}%)</h1>
      <a
        v-if="project.githubUrl"
        :href="project.githubUrl"
      >Github</a>
      <p
        v-for="task of project.tasks"
        :key="task.title"
      >
        [{{ task.status }}] {{ task.title }}
      </p>
      <hr>
    </div>
    <p v-if="projects.length === 0">
      No projects
    </p>
  </div>
</template>
