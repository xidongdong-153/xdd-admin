import type { AxiosRequestConfig } from "axios";

export interface HttpClientConfig {
	baseURL: string;
	timeout?: number;
	headers?: Record<string, string>;
}

export interface RequestOptions
	extends Omit<AxiosRequestConfig, "baseURL" | "url" | "method" | "data"> {
	skipAuthHeader?: boolean;
	retry?: number;
}

// API响应的统一类型定义
export interface ApiResponse<T = unknown> {
	statusCode: number;
	message: string;
	data: T;
	timestamp: string;
	path: string;
	method: string;
}

// API错误响应的类型定义
export interface ApiError {
	statusCode: number;
	message: string;
	error: string;
	path: string;
	method: string;
	timestamp: string;
}

// 分页元数据的类型定义
export interface PaginationMeta {
	/**
	 * 总条数
	 */
	itemCount: number;

	/**
	 * 总条数
	 */
	totalItems: number;

	/**
	 * 每页条数
	 */
	perPage: number;

	/**
	 * 总页数
	 */
	totalPages: number;

	/**
	 * 当前页码
	 */
	currentPage: number;
}

// 分页数据的类型定义
export interface PaginatedData<T> {
	items: T[];
	meta: PaginationMeta;
}

// 分页查询参数的类型定义
export interface PaginationQuery {
	/**
	 * 当前页码
	 * @default 1
	 */
	page: number;

	/**
	 * 每页条数
	 * @default 10
	 */
	limit: number;
}

export interface HttpResponse<T> {
	data: ApiResponse<T>;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface HttpClient {
	request<TResponse, TRequest = unknown>(
		method: HttpMethod,
		url: string,
		data?: TRequest,
		options?: RequestOptions,
	): Promise<HttpResponse<TResponse>>;

	setAuthToken(token: string): void;
	clearAuthToken(): void;
}
