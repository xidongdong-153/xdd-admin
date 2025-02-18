import type { PaginatedData, PaginationQuery } from "@/api/core/types";
import type { RoleInfo } from "@/api/modules/role/types";

/**
 * 权限信息
 */
export interface PermissionInfo {
	/** 权限ID */
	id: number;
	/** 权限名称 */
	name: string;
	/** 权限描述 */
	description: string;
	/** 模块名称 */
	module: string;
	/** 操作名称 */
	action: string;
	/** 角色列表 */
	roles: RoleInfo[];
	/** 创建时间 */
	createdAt: string;
	/** 更新时间 */
	updatedAt: string;
}

/**
 * 创建权限
 */
export interface CreatePermission {
	/** 权限编码 */
	code: string;
	/** 权限名称 */
	name: string;
	/** 权限描述 */
	description: string;
	/** 模块名称 */
	module: string;
	/** 操作名称 */
	action: string;
}

/**
 * 获取权限列表请求参数
 */
export interface PermissionListRequest extends PaginationQuery {
	/** 权限编码 */
	code?: string;
	/** 模块名称 */
	module?: string;
}

/**
 * 获取权限列表响应
 */
export type PermissionListResponse = PaginatedData<PermissionInfo>;
