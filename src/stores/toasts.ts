export type ToastContent = {
	type: 'success' | 'error';
	text: string;
};

export type ToastItem = {
	id: number;
	content: ToastContent;
};

export const useToasts = defineStore('toasts', () => {
	let idCounter = 0;
	const toasts = ref<ToastItem[]>([]);
	const readonlyToasts = computed(() => toasts.value);

	return {
		getAll() {
			return readonlyToasts.value;
		},
		remove(id: number) {
			toasts.value = toasts.value.filter(v => v.id !== id);
		},
		publish(item: ToastContent) {
			toasts.value.push({
				id: idCounter++,
				content: item
			});
		}
	};
});
