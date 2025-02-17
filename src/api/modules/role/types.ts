import type { PaginatedData, PaginationQuery } from "@/api/core/types";

/**
 * 角色信息
 */
export interface RoleInfo {
	/** 角色ID */
	id: number;
	/** 角色名称 */
	name: string;
	/** 是否系统角色 */
	isSystem: boolean;
	/** 权限列表 */
	permissions: string[];
	/** 用户列表 */
	users: [];
	/** 角色描述 */
	description: string;
	/** 创建时间 */
	createdAt: string;
	/** 更新时间 */
	updatedAt: string;
}

/**
 * 创建角色
 */
export interface CreateRole {
	name: string;
	description: string;
}

/**
 * 获取角色列表请求参数
 */
export interface RoleListRequest extends PaginationQuery {
	name?: string;
	description?: string;
}

/**
 * 获取角色列表响应
 */
export type RoleListResponse = PaginatedData<RoleInfo>;
