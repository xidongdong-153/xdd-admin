import type { ContentListConfig } from "@/components/business/search-list/types";
import type {
	PermissionInfo,
	PermissionListRequest,
	CreatePermission,
} from "@/api/modules/permission/types";
import { PermissionApi } from "@/api/modules/permission/permission-api";
import { getCreateFormConfig } from "./form.config";

// 获取列表配置
export const getListConfig = (): ContentListConfig<
	PermissionInfo,
	PermissionListRequest,
	CreatePermission
> => ({
	// API 配置
	api: {
		getList: PermissionApi.getList,
		delete: PermissionApi.delete,
		create: PermissionApi.create,
		update: PermissionApi.update,
	},

	// 查询参数
	queryParams: {
		page: 1,
		limit: 10,
	},

	// 列配置
	columns: [
		{ prop: "id", label: "ID", visible: true, width: 80, fixed: "left" },
		{ prop: "code" as keyof PermissionInfo, label: "权限编码", visible: true },
		{ prop: "name", label: "权限名称", visible: true },
		{ prop: "description", label: "权限描述", visible: true },
		{ prop: "module", label: "模块名称", visible: true },
		{ prop: "action", label: "操作名称", visible: true },
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
