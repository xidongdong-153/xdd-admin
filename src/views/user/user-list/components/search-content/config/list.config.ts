import { h } from "vue";
import { ElTag } from "element-plus";
import type { ContentListConfig } from "@/components/business/search-list/types";
import type { UserInfo, UserListRequest } from "@/api/modules/user/types";
import { UserApi } from "@/api/modules/user/user-api";
import { UserStatus } from "../types";

// 状态配置
export const statusConfig = {
	[UserStatus.ACTIVE]: { type: "success", label: "启用" },
	[UserStatus.INACTIVE]: { type: "info", label: "禁用" },
	[UserStatus.LOCKED]: { type: "danger", label: "锁定" },
} as const;

// 获取列表配置
export const getListConfig = (
	handleEdit: (row: UserInfo) => void,
	handleDelete: (row: UserInfo) => void,
): ContentListConfig<UserInfo, UserListRequest> => ({
	// API 配置
	api: {
		getList: UserApi.getList,
		delete: UserApi.delete,
	},

	// 查询参数
	queryParams: {
		page: 1,
		limit: 10,
	},

	// 列配置
	columns: [
		{ prop: "id", label: "ID", visible: true, width: 80, fixed: "left" },
		{ prop: "username", label: "用户名", visible: true },
		{ prop: "email", label: "邮箱", visible: true },
		{
			prop: "status",
			label: "状态",
			visible: true,
			render: (row) => {
				const config = statusConfig[row.status as UserStatus];
				return h(ElTag, { type: config.type }, () => config.label);
			},
		},
		{ prop: "createdAt", label: "创建时间", visible: true },
	],

	// 操作按钮
	actions: [
		{
			label: "编辑",
			type: "primary",
			onClick: handleEdit,
		},
		{
			label: "删除",
			type: "danger",
			onClick: handleDelete,
		},
	],

	// 工具栏配置
	toolbar: {
		showAdd: true,
		showRefresh: true,
		showColumnSetting: true,
	},
});
