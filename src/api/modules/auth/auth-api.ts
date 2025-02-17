import { request } from "@/api/core/request";
import type {
	LoginData,
	LoginResponse,
	RefreshTokenData,
	RefreshTokenResponse,
} from "@/api/modules/auth/types";

/**
 * 认证 API
 */
export const AuthApi = {
	/**
	 * 登录
	 * @param data 登录数据
	 */
	login(data: LoginData) {
		return request.post<LoginResponse>("/api/auth/login", data);
	},
	/**
	 * 刷新令牌
	 * @param data 刷新令牌数据
	 */
	refreshToken(data: RefreshTokenData) {
		return request.post<RefreshTokenResponse>("/api/auth/refresh", data);
	},
};
