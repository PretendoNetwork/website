export type Me = {
	pid: number;
	username: string;
	mii: {
		imageUrl: string;
		name: string;
	} | null;
};

export const useMeStore = defineStore('me', () => {
	const data = ref<Me | null>(null);
	const loaded = ref(false);

	function setMe(input: Me | null): void {
		data.value = input;
		loaded.value = true;
	}

	function clear(): void {
		data.value = null;
	}

	return {
		user: computed(() => data.value),
		loaded: computed(() => loaded.value),
		setMe,
		clear
	};
});
