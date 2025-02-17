import { h } from "vue";
import { ElTag } from "element-plus";
import type { ContentListConfig } from "@/components/business/search-list/types";
import type { RoleInfo, RoleListRequest } from "@/api/modules/role/types";
import { RoleApi } from "@/api/modules/role/role-api";

// 获取列表配置
export const getListConfig = (
	handleEdit: (row: RoleInfo) => void,
	handleDelete: (row: RoleInfo) => void,
): ContentListConfig<RoleInfo, RoleListRequest> => ({
	// API 配置
	api: {
		getList: RoleApi.getList,
		delete: RoleApi.delete,
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

	// 操作按钮
	actions: [
		{
			label: "编辑",
			type: "primary",
			onClick: handleEdit,
			show: (row) => !row.isSystem,
		},
		{
			label: "删除",
			type: "danger",
			onClick: handleDelete,
			show: (row) => !row.isSystem,
		},
	],

	// 工具栏配置
	toolbar: {
		showAdd: true,
		showRefresh: true,
		showColumnSetting: true,
	},
});
