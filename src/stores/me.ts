export type Me = {
	pid: number;
	username: string;
};

export const useMeStore = defineStore("me", () => {
	const data = ref<Me | null>(null);
	const loaded = ref(false);

	function setMe(input: Me | null) {
		data.value = input;
		loaded.value = true;
	}

	function clear() {
		data.value = null;
	}

	return {
		user: computed(() => data.value),
		loaded: computed(() => loaded.value),
		setMe,
		clear,
	};
});
