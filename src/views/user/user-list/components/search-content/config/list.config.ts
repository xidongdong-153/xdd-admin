import { h } from "vue";
import { ElTag } from "element-plus";
import type { ContentListConfig } from "@/components/business/search-list/types";
import type { UserInfo, UserListRequest, CreateUser } from "@/api/modules/user/types";
import { UserApi } from "@/api/modules/user/user-api";
import { UserStatus } from "../types";
import { getCreateFormConfig } from "./form.config";

// 状态配置
export const statusConfig = {
	[UserStatus.ACTIVE]: { type: "success", label: "启用" },
	[UserStatus.INACTIVE]: { type: "info", label: "禁用" },
	[UserStatus.LOCKED]: { type: "danger", label: "锁定" },
} as const;

// 获取列表配置
export const getListConfig = (): ContentListConfig<UserInfo, UserListRequest, CreateUser> => ({
	// API 配置
	api: {
		getList: UserApi.getList,
		delete: UserApi.delete,
		create: UserApi.create,
		update: UserApi.update,
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

	// 工具栏配置
	toolbar: {
		showAdd: true,
		showRefresh: true,
		showColumnSetting: true,
	},

	// 表单配置
	formConfig: getCreateFormConfig(),

	// 控制操作列显示
	showActions: true,
});
