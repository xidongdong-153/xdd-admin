import type { PaginatedData, PaginationQuery } from "@/api/core/types";

/**
 * 用户信息
 */
export interface UserInfo extends Record<string, unknown> {
	/** 用户ID */
	id: number;
	/** 用户名 */
	username: string;
	/** 昵称 */
	nickname: string;
	/** 手机号 */
	phone: string;
	/** 邮箱 */
	email: string;
	/** 状态 */
	status: "active" | "inactive";
	/** 最后登录时间 */
	lastLoginAt: string;
	/** 创建时间 */
	createdAt: string;
	/** 更新时间 */
	updatedAt: string;
}

/**
 * 创建用户
 */
export interface CreateUser {
	username: string;
	email: string;
	password: string;
}

/**
 * 获取用户列表请求参数
 */
export interface UserListRequest extends PaginationQuery {
	username?: string;
	email?: string;
	status?: string;
}

/**
 * 获取用户列表响应
 */
export type UserListResponse = PaginatedData<UserInfo>;
