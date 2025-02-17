export interface LoginData {
	/**
	 * 用户名/邮箱
	 */
	credential: string;
	/**
	 * 密码
	 */
	password: string;
}

export interface LoginResponse {
	/**
	 * 访问令牌
	 */
	accessToken: string;
	/**
	 * 刷新令牌
	 */
	refreshToken: string;
}

export interface RefreshTokenData {
	/**
	 * 刷新令牌
	 */
	refreshToken: string;
}

export type RefreshTokenResponse = Pick<LoginResponse, "accessToken">;
