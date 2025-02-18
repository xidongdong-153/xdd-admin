import { h } from "vue";
import { ElTag } from "element-plus";
import type { ContentListConfig } from "@/components/business/search-list/types";
import type { RoleInfo, RoleListRequest, CreateRole } from "@/api/modules/role/types";
import { RoleApi } from "@/api/modules/role/role-api";
import { getCreateFormConfig } from "./form.config";

// 获取列表配置
export const getListConfig = (): ContentListConfig<RoleInfo, RoleListRequest, CreateRole> => ({
	// API 配置
	api: {
		getList: RoleApi.getList,
		delete: RoleApi.delete,
		create: RoleApi.create,
		update: RoleApi.update,
	},

	// 查询参数
	queryParams: {
		page: 1,
		limit: 10,
	},

	// 列配置
	columns: [
		{ prop: "id", label: "ID", visible: true, width: 80, fixed: "left" },
		{ prop: "name", label: "角色名称", visible: true },
		{ prop: "description", label: "角色描述", visible: true },
		{
			prop: "isSystem",
			label: "系统角色",
			visible: true,
			render: (row) => {
				return h(ElTag, { type: row.isSystem ? "danger" : "info" }, () =>
					row.isSystem ? "是" : "否",
				);
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

	// 控制系统角色不允许编辑和删除
	showActions: true,
	actions: [
		// {
		// 	label: "编辑",
		// 	type: "primary",
		// 	onClick: () => {}, // 使用内置编辑功能，这里仅用于控制显示
		// 	show: (row) => !row.isSystem,
		// },
	],
});
