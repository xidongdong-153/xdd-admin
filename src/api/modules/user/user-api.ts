import { request } from "@/api/core/request";
import type { CreateUser, UserInfo, UserListRequest, UserListResponse } from "./types";

/**
 * 用户 API
 */
export const UserApi = {
	/**
	 * 获取用户信息
	 */
	getCurrentUser() {
		console.log("执行获取用户信息");
		return request.get<UserInfo>("/api/users/me");
	},
	/**
	 * 获取用户列表
	 */
	getList(params: UserListRequest) {
		return request.get<UserListResponse>("/api/users", params);
	},
	/**
	 * 获取用户详情
	 */
	getDetail(id: number) {
		return request.get<UserInfo>(`/api/users/${id}`);
	},
	/**
	 * 创建用户
	 */
	create(data: CreateUser) {
		return request.post<UserInfo>("/api/users", data);
	},
	/**
	 * 更新用户
	 */
	update(id: number, data: Partial<UserInfo>) {
		return request.patch<UserInfo>(`/api/users/${id}`, data);
	},
	/**
	 * 删除用户
	 */
	delete(id: number) {
		return request.delete<UserInfo>(`/api/users/${id}`);
	},
};
