import { defineStore } from "pinia";
import { ref } from "vue";
import { ApiService } from "@/api/core/request";

export const TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export const useAuthStore = defineStore("auth", () => {
	const token = ref<string>(localStorage.getItem(TOKEN_KEY) || "");
	const refreshToken = ref<string>(localStorage.getItem(REFRESH_TOKEN_KEY) || "");

	// 设置访问令牌
	const setToken = (accessToken: string, refreshTokenValue: string) => {
		token.value = accessToken;
		refreshToken.value = refreshTokenValue;

		// 存储到本地
		localStorage.setItem(TOKEN_KEY, accessToken);
		localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenValue);

		// 设置 API 客户端的认证头
		const apiClient = ApiService.getInstance("xdd-api", {
			baseURL: import.meta.env.VITE_API_BASE_URL,
			timeout: 10000,
		});
		apiClient.setAuthToken(accessToken);
	};

	// 清除令牌
	const clearToken = () => {
		token.value = "";
		refreshToken.value = "";

		// 清除本地存储
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);

		// 清除 API 客户端的认证头
		const apiClient = ApiService.getInstance("xdd-api", {
			baseURL: import.meta.env.VITE_API_BASE_URL,
			timeout: 10000,
		});
		apiClient.clearAuthToken();
	};

	// 检查是否已认证
	const isAuthenticated = () => {
		return !!token.value;
	};

	return {
		token,
		refreshToken,
		setToken,
		clearToken,
		isAuthenticated,
	};
});
