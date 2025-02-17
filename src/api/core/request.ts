import type { HttpClientConfig, RequestOptions } from "./types";
import { HttpClientImpl } from "./http-client";

/**
 * API 客户端管理
 */
export class ApiService {
	private static instances = new Map<string, HttpClientImpl>();

	public static getInstance(name: string, config: HttpClientConfig): HttpClientImpl {
		if (!this.instances.has(name)) {
			this.instances.set(name, new HttpClientImpl(config));
		}
		return this.instances.get(name)!;
	}

	public static clearInstance(name: string): void {
		this.instances.delete(name);
	}
}

/**
 * XDD API 客户端
 */
const xddAPIClient = ApiService.getInstance("xdd-api", {
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 10000,
});

// 请求方法封装
export const request = {
	get<TResponse, TRequest = unknown>(url: string, params?: TRequest, options?: RequestOptions) {
		return xddAPIClient.request<TResponse, TRequest>("GET", url, params, options);
	},

	post<TResponse, TRequest = unknown>(url: string, data?: TRequest, options?: RequestOptions) {
		return xddAPIClient.request<TResponse, TRequest>("POST", url, data, options);
	},

	patch<TResponse, TRequest = unknown>(url: string, data?: TRequest, options?: RequestOptions) {
		return xddAPIClient.request<TResponse, TRequest>("PATCH", url, data, options);
	},

	delete<TResponse, TRequest = unknown>(url: string, data?: TRequest, options?: RequestOptions) {
		return xddAPIClient.request<TResponse, TRequest>("DELETE", url, data, options);
	},
};
