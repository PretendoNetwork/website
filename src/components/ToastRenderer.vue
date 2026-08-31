<script setup lang="ts">
import { Toast } from 'reka-ui/namespaced';

const toastStore = useToasts();
const route = useRoute();
const routeKey = computed(() => route.path);

watch(routeKey, () => {
	toastStore.clear(); // Clear toasts when route changes
});
onUnmounted(() => {
	toastStore.clear(); // Clear toasts toast rendered gets removed (route change)
});

function handleOpenUpdate(id: number, open: boolean) {
	if (!open) {
		setTimeout(() => {
			toastStore.remove(id);
		}, 1000);
	}
}
</script>

<template>
  <Toast.Provider disable-swipe>
    <div
      v-for="toast of toastStore.getAll()"
      :key="toast.id"
    >
      <Toast.Root
        v-slot="{ open }"
        as-child
        force-mount

        @update:open="val => handleOpenUpdate(toast.id, val)"
      >
        <div
          class="toast"
          :class="{
            'type-success': toast.content.type === 'success',
            'type-error': toast.content.type === 'error',
          }"
        >
          <Transition
            name="toast-slide"
            appear
          >
            <div
              v-if="open"
              class="content"
            >
              <Toast.Title>
                {{ toast.content.text }}
              </Toast.Title>
            </div>
          </Transition>
        </div>
      </Toast.Root>
    </div>

    <Toast.Viewport class="toast-viewport" />
  </Toast.Provider>
</template>

<style scoped>
.toast {
	bottom: 0;
	position: absolute;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	pointer-events: none;
	text-align: center;
}
.toast .content {
	border-radius: 5px;
	padding: 1em 2em;
	pointer-events: initial;
}
.toast.type-error .content {
	background: var(--red-shade-1);
}
.toast.type-success .content {
	background: var(--green-shade-0);
}
</style>

<style>
.toast-viewport {
	z-index: 105;
	display: flex;
	justify-content: center;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 35px;
	pointer-events: none;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
	transition: transform 500ms ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
	transform: translateY(150px);
}

.toast-slide-enter-to,
.toast-slide-leave-from {
	transform: translateY(0px);
}
</style>
