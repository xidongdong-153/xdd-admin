import type { PaginatedData, PaginationQuery } from "@/api/core/types";
import type { PermissionInfo } from "../permission/types";
import type { UserInfo } from "../user/types";

/**
 * 角色信息
 */
export interface RoleInfo {
	/** 角色ID */
	id: number;
	/** 角色编码 */
	code: string;
	/** 角色名称 */
	name: string;
	/** 角色描述 */
	description?: string;
	/** 父角色ID */
	parentId?: string;
	/** 排序值 */
	sort: number;
	/** 是否启用 */
	isEnabled: boolean;
	/** 是否系统角色 */
	isSystem: boolean;
	/** 权限列表 */
	permissions: PermissionInfo[];
	/** 用户列表 */
	users: UserInfo[];
	/** 创建时间 */
	createdAt: string;
	/** 更新时间 */
	updatedAt: string;
}

/**
 * 创建角色请求参数
 */
export interface CreateRole {
	/** 角色编码 */
	code: string;
	/** 角色名称 */
	name: string;
	/** 角色描述 */
	description?: string;
	/** 父角色ID */
	parentId?: string;
	/** 排序值 */
	sort?: number;
	/** 是否启用 */
	isEnabled?: boolean;
	/** 是否系统角色 */
	isSystem?: boolean;
	/** 权限列表 */
	permissions?: number[];
}

/**
 * 更新角色请求参数
 */
export type UpdateRole = Partial<CreateRole>;

/**
 * 获取角色列表请求参数
 */
export interface RoleListRequest extends PaginationQuery {
	/** 角色名称，可选 */
	name?: string;
}

/**
 * 获取角色列表响应
 */
export type RoleListResponse = PaginatedData<RoleInfo>;
