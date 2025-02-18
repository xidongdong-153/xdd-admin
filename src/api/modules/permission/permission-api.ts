import { request } from "@/api/core/request";
import type {
	CreatePermission,
	PermissionInfo,
	PermissionListRequest,
	PermissionListResponse,
} from "./types";

/**
 * 权限 API
 */
export const PermissionApi = {
	/**
	 * 获取权限列表
	 */
	getList(params: PermissionListRequest) {
		return request.get<PermissionListResponse>("/api/permissions", params);
	},
	/**
	 * 获取角色详情
	 */
	getDetail(id: number) {
		return request.get<PermissionInfo>(`/api/permissions/${id}`);
	},
	/**
	 * 创建权限
	 */
	create(data: CreatePermission) {
		return request.post<PermissionInfo>("/api/permissions", data);
	},
	/**
	 * 更新角色
	 */
	update(id: number, data: Partial<PermissionInfo>) {
		return request.patch<PermissionInfo>(`/api/permissions/${id}`, data);
	},
	/**
	 * 删除权限
	 */
	delete(id: number) {
		return request.delete<PermissionInfo>(`/api/permissions/${id}`);
	},
};
