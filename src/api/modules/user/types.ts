import type { PaginatedData, PaginationQuery } from "@/api/core/types";
import type { RoleInfo } from "../role/types";

/**
 * 用户状态枚举
 */
export enum UserStatus {
	Active = "active",
	Inactive = "inactive",
	Locked = "locked",
	PendingVerification = "pending_verification",
	Suspended = "suspended",
}

/**
 * 用户信息接口
 */
export interface UserInfo extends Record<string, unknown> {
	/** 用户ID */
	id: number;
	/** 用户名 */
	username: string;
	/** 昵称 */
	nickname: string;
	/** 头像URL */
	avatar?: string;
	/** 手机号码 */
	phoneNumber?: string;
	/** 邮箱 */
	email: string;
	/** 邮箱验证状态 */
	isEmailVerified: boolean;
	/** 状态 */
	status: UserStatus;
	/** 登录尝试次数 */
	loginAttempts: number;
	/** 最后登录时间 */
	lastLoginAt?: string;
	/** 最后密码修改时间 */
	lastPasswordChange?: string;
	/** 创建时间 */
	createdAt: string;
	/** 更新时间 */
	updatedAt: string;
	/** 用户角色列表 */
	roles?: RoleInfo[];
}

/**
 * 创建用户请求参数
 */
export interface CreateUser {
	/** 用户名 */
	username: string;
	/** 昵称 */
	nickname: string;
	/** 密码 */
	password: string;
	/** 头像URL */
	avatar?: string;
	/** 邮箱 */
	email: string;
	/** 手机号码 */
	phoneNumber?: string;
}

/**
 * 更新用户请求参数
 */
export interface UpdateUserRequest extends Partial<Omit<CreateUser, "password">> {
	/** 用户状态 */
	status?: UserStatus;
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
	/** 旧密码 */
	oldPassword: string;
	/** 新密码 */
	newPassword: string;
}

/**
 * 获取用户列表请求参数
 */
export interface UserListRequest extends PaginationQuery {
	/** 用户名 */
	username?: string;
	/** 邮箱 */
	email?: string;
	/** 状态 */
	status?: UserStatus;
}

/**
 * 获取用户列表响应
 */
export type UserListResponse = PaginatedData<UserInfo>;
