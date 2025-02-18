import { request } from "@/api/core/request";
import type { CreateRole, RoleInfo, RoleListRequest, RoleListResponse } from "./types";

/**
 * 角色 API
 */
export const RoleApi = {
	/**
	 * 获取角色列表
	 */
	getList(params: RoleListRequest) {
		return request.get<RoleListResponse>("/api/roles", params);
	},
	/**
	 * 获取角色详情
	 */
	getDetail(id: number) {
		return request.get<RoleInfo>(`/api/roles/${id}`);
	},
	/**
	 * 创建角色
	 */
	create(data: CreateRole) {
		return request.post<RoleInfo>("/api/roles", data);
	},
	/**
	 * 更新角色
	 */
	update(id: number, data: Partial<RoleInfo>) {
		return request.patch<RoleInfo>(`/api/roles/${id}`, data);
	},
	/**
	 * 删除角色
	 */
	delete(id: number) {
		return request.delete<RoleInfo>(`/api/roles/${id}`);
	},
	/**
	 * 分配权限
	 */
	assignPermissions(id: number, data: { permissions: number[] }) {
		return request.post<RoleInfo>(`/api/roles/${id}/permissions`, data);
	},
};
