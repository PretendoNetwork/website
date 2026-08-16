import { useAsyncState } from '@vueuse/core';

export type UseAsyncOptions<TResult, TArgs extends any[] = []> = {
	handler(...args: TArgs): Promise<TResult>;
	onSuccess?: (data: TResult) => void;
	onError?: (error: any) => void;
	allowParallel?: boolean;
};

export type UseAsyncResult<TResult, TArgs extends any[] = []> = {
	state: Ref<TResult | null>;
	isLoading: Ref<boolean>;
	error: Ref<unknown>;
	execute: (...args: TArgs) => Promise<void>;
};

export function useAsync<TResult, TArgs extends any[] = []>(ops: UseAsyncOptions<TResult, TArgs>): UseAsyncResult<TResult, TArgs> {
	const preventDuringLoading = !ops.allowParallel;
	const output = useAsyncState<TResult | null, TArgs, true>(ops.handler, null, {
		immediate: false,
		onSuccess(data) {
			ops.onSuccess?.(data as any);
		},
		onError(err) {
			ops.onError?.(err);
		}
	});

	async function execute(...args: TArgs) {
		if (preventDuringLoading && output.isLoading.value) {
			return;
		}

		await output.executeImmediate(...args);
	}

	return {
		state: output.state,
		isLoading: output.isLoading,
		error: output.error,
		execute
	};
}
