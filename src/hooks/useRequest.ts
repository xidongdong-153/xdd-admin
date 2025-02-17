import { ref, shallowRef, type Ref } from "vue";
import type { ApiError, HttpResponse } from "@/api/core/types";

/**
 * 请求配置选项
 * @template TData 响应数据类型
 */
export interface RequestOptions<TData = unknown> {
	/**
	 * 是否在初始化时自动执行请求
	 * @default true
	 */
	immediate?: boolean;

	/**
	 * 请求失败后自动重试的次数
	 * @default 0
	 */
	retryCount?: number;

	/**
	 * 重试间隔时间（毫秒）
	 * @default 1000
	 */
	retryInterval?: number;

	/**
	 * 请求成功的回调函数
	 * @param data 响应数据
	 */
	onSuccess?: (data: TData) => void;

	/**
	 * 请求失败的回调函数
	 * @param error 错误信息
	 */
	onError?: (error: ApiError) => void;

	/**
	 * 请求完成的回调函数（无论成功或失败）
	 */
	onFinally?: () => void;
}

/**
 * 请求Hook返回结果
 * @template TData 响应数据类型
 * @template TParams 请求参数类型元组
 */
interface RequestResult<TData, TParams extends unknown[]> {
	/** 响应数据 ref */
	data: Ref<TData | undefined>;

	/** 请求加载状态 */
	loading: Ref<boolean>;

	/** 请求错误信息 */
	error: Ref<ApiError | null>;

	/**
	 * 执行请求方法
	 * @param args 请求参数
	 * @returns Promise<TData> 响应数据
	 */
	run: (...args: TParams) => Promise<TData>;

	/** 取消当前请求 */
	cancel: () => void;

	/**
	 * 使用初始参数刷新请求
	 * @throws {Error} 如果没有提供初始参数
	 */
	refresh: () => Promise<TData>;
}

/**
 * 通用的异步请求处理 Hook
 *
 * @template TData 响应数据类型
 * @template TParams 请求参数类型元组
 * @param requestFn 请求函数
 * @param params 初始请求参数
 * @param options 配置选项
 * @returns RequestResult 请求结果对象
 */
export function useRequest<TData, TParams extends unknown[] = unknown[]>(
	requestFn: (...args: TParams) => Promise<HttpResponse<TData>>,
	params?: TParams,
	options: RequestOptions<TData> = {},
): RequestResult<TData, TParams> {
	const {
		immediate = true,
		retryCount = 0,
		retryInterval = 1000,
		onSuccess,
		onError,
		onFinally,
	} = options;

	// 状态管理
	const data = shallowRef<TData | undefined>(undefined);
	const loading = ref(false);
	const error = ref<ApiError | null>(null);

	// 请求控制
	let cancelTokenSource: AbortController;

	// 重试控制
	let retryTimes = 0;
	let retryTimer: ReturnType<typeof setTimeout>;

	const run = async (...args: TParams): Promise<TData> => {
		// 取消进行中的请求
		if (loading.value) {
			cancel();
		}

		// 初始化请求状态
		loading.value = true;
		error.value = null;

		// 创建取消令牌
		cancelTokenSource = new AbortController();

		try {
			const response = await requestFn(...args);
			const result = response.data.data;
			data.value = result;

			// 重置重试状态
			retryTimes = 0;

			// 更新加载状态
			loading.value = false;

			// 触发成功回调
			onSuccess?.(result);

			return result;
		} catch (err) {
			error.value = err as ApiError;

			// 处理请求重试
			if (retryTimes < retryCount) {
				retryTimes++;
				retryTimer = setTimeout(() => {
					run(...args);
				}, retryInterval);
			}

			// 更新加载状态
			loading.value = false;

			// 触发错误回调
			onError?.(err as ApiError);
			throw err;
		} finally {
			// 触发完成回调
			onFinally?.();
		}
	};

	const cancel = () => {
		if (cancelTokenSource) {
			cancelTokenSource.abort();
		}
		if (retryTimer) {
			clearTimeout(retryTimer);
		}
		loading.value = false;
	};

	const refresh = () => {
		if (!params) {
			throw new Error("No params provided for refresh");
		}
		return run(...params);
	};

	// 自动执行
	if (immediate && params) {
		run(...params);
	}

	return {
		data,
		loading,
		error,
		run,
		cancel,
		refresh,
	};
}
