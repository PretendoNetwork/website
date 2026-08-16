<template>
  <div class="loader" />
</template>

<style scoped>
.loader {
	width: 2em;
	display: inline-block;
	aspect-ratio: 2;
	--_g: no-repeat radial-gradient(circle closest-side, currentColor 90%, #0000);
	background:
		var(--_g) 0% 50%,
		var(--_g) 50% 50%,
		var(--_g) 100% 50%;
	background-size: calc(100%/3) 50%;
	animation: loader-anim 1s infinite linear;
}
</style>

<style>
@keyframes loader-anim {
	20% {
		background-position: 0% 0%, 50% 50%, 100% 50%
	}
	40% {
		background-position: 0% 100%, 50% 0%, 100% 50%
	}
	60% {
		background-position: 0% 50%, 50% 100%, 100% 0%
	}
	80% {
		background-position: 0% 50%, 50% 50%, 100% 100%
	}
}
</style>
