import axios from "axios";
import type {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	CancelToken,
} from "axios";

import { HTTP_CONSTANTS } from "./constants";
import type {
	HttpClient,
	HttpClientConfig,
	HttpResponse,
	RequestOptions,
	HttpMethod,
	ApiResponse,
	ApiError,
} from "./types";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { AuthApi } from "../modules/auth/auth-api";
import router from "@/router";

/**
 * HTTP客户端封装
 * @class HttpClient
 * @implements {HttpClient}
 */
export class HttpClientImpl implements HttpClient {
	private instance: AxiosInstance;
	private config: HttpClientConfig;

	/**
	 * 创建HTTP客户端实例
	 * @param {HttpClientConfig} config - 客户端配置
	 */
	constructor(config: HttpClientConfig) {
		this.config = config;
		this.instance = this.createAxiosInstance(config);
		this.setupInterceptors();
	}

	private createAxiosInstance(config: HttpClientConfig): AxiosInstance {
		return axios.create({
			baseURL: config.baseURL,
			timeout: config.timeout || HTTP_CONSTANTS.TIMEOUT,
			headers: {
				...config.headers,
			},
		});
	}

	private setupInterceptors(): void {
		this.instance.interceptors.request.use(
			(config) => {
				// 请求拦截器逻辑
				return config;
			},
			(error) => Promise.reject(error),
		);

		this.instance.interceptors.response.use(
			<T>(response: AxiosResponse<ApiResponse<T>>): AxiosResponse<ApiResponse<T>> => {
				return response;
			},
			async (error: AxiosError<ApiError>) => {
				const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

				// 如果是 401 错误且不是刷新token的请求，且不是登录请求
				if (
					error.response?.status === 401 &&
					!originalRequest._retry &&
					!originalRequest.url?.includes("/api/auth/refresh") &&
					!originalRequest.url?.includes("/api/auth/login")
				) {
					originalRequest._retry = true;

					try {
						// 获取 auth store
						const authStore = useAuthStore();
						const refreshToken = authStore.refreshToken;

						if (!refreshToken) {
							throw new Error("No refresh token");
						}

						// 尝试刷新 token
						const response = await AuthApi.refreshToken({ refreshToken });

						// 更新 token
						authStore.setToken(response.data.data.accessToken, refreshToken);

						// 重试原请求
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
						}
						return this.instance(originalRequest);
					} catch (refreshError) {
						// 刷新失败，清除用户信息并跳转登录
						const authStore = useAuthStore();
						const userStore = useUserStore();

						authStore.clearToken();
						userStore.clearUserInfo();

						router.push({
							path: "/login",
							query: {
								redirect: router.currentRoute.value.fullPath,
								message: "登录已过期，请重新登录",
							},
						});

						return Promise.reject(refreshError);
					}
				}

				return this.handleError(error);
			},
		);
	}

	private handleError(error: AxiosError<ApiError>): Promise<never> {
		// 如果是后端返回的标准错误格式
		if (error.response?.data) {
			return Promise.reject(error.response.data);
		}

		// 如果是网络错误等其他错误
		const apiError: ApiError = {
			statusCode: error.response?.status || 500,
			message: error.message || "未知错误",
			error: error.name || "UnknownError",
			path: error.config?.url || "",
			method: (error.config?.method || "UNKNOWN").toUpperCase(),
			timestamp: new Date().toISOString(),
		};

		return Promise.reject(apiError);
	}

	public createCancelToken() {
		return axios.CancelToken.source();
	}

	public async request<TResponse = unknown, TRequest = Record<string, unknown>>(
		method: HttpMethod,
		url: string,
		data?: TRequest,
		options?: RequestOptions & { cancelToken?: CancelToken },
	): Promise<HttpResponse<TResponse>> {
		try {
			const requestConfig: AxiosRequestConfig = {
				method,
				url,
			};

			if (options) {
				const { ...axiosOptions } = options;
				Object.assign(requestConfig, axiosOptions);
			}

			if (method === "GET") {
				requestConfig.params = data;
			} else {
				requestConfig.data = data;
			}

			const response = await this.instance.request<ApiResponse<TResponse>>(requestConfig);
			const { data: responseData } = response;

			return {
				data: responseData,
			};
		} catch (error) {
			throw error;
		}
	}

	public setAuthToken(token: string): void {
		this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
	}

	public clearAuthToken(): void {
		delete this.instance.defaults.headers.common.Authorization;
	}
}
