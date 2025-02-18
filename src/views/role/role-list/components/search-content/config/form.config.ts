import type { SearchForm } from "../types";
import type { FormRules } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import {
	FormItemType,
	type FormItemConfig,
	type FormConfig,
} from "@/components/business/search-list/types";
import type { CreateRole } from "@/api/modules/role/types";

// 默认表单数据
export const defaultSearchForm: SearchForm = {
	name: "",
	description: "",
	permissions: [],
};

// 搜索表单配置
export const getFormConfig = (): FormItemConfig[] => [
	{
		field: "name",
		label: "角色名称",
		type: FormItemType.INPUT,
		placeholder: "请输入角色名称",
		icon: ElementPlusIconsVue.User,
		span: 8,
		rules: [
			{
				min: 2,
				message: "角色名称至少2个字符",
				trigger: "blur",
			},
		],
	},
];

// 新增角色表单配置
export const getCreateFormConfig = (): FormConfig<CreateRole> => ({
	fields: [
		{
			field: "name",
			label: "角色名称",
			type: FormItemType.INPUT,
			placeholder: "请输入角色名称",
			icon: ElementPlusIconsVue.User,
			rules: [
				{
					required: true,
					message: "请输入角色名称",
					trigger: "blur",
				},
				{
					min: 2,
					message: "角色名称至少2个字符",
					trigger: "blur",
				},
			],
		},
		{
			field: "description",
			label: "角色描述",
			type: FormItemType.INPUT,
			placeholder: "请输入角色描述",
			icon: ElementPlusIconsVue.Document,
			rules: [
				{
					required: true,
					message: "请输入角色描述",
					trigger: "blur",
				},
				{
					min: 2,
					message: "角色描述至少2个字符",
					trigger: "blur",
				},
			],
		},
		{
			field: "permissions",
			label: "权限列表",
			type: FormItemType.SELECT,
			placeholder: "请选择权限",
			icon: ElementPlusIconsVue.Document,
		},
	],
	rules: {
		name: [
			{
				required: true,
				message: "请输入角色名称",
				trigger: "blur",
			},
			{
				min: 2,
				message: "角色名称至少2个字符",
				trigger: "blur",
			},
		],
		description: [
			{
				required: true,
				message: "请输入角色描述",
				trigger: "blur",
			},
			{
				min: 2,
				message: "角色描述至少2个字符",
				trigger: "blur",
			},
		],
		permissions: [
			{
				required: true,
				message: "请选择权限",
				trigger: "blur",
			},
		],
	},
	width: "500px",
});

// 生成验证规则
export const generateRules = (config: FormItemConfig[]): FormRules => {
	const rules: FormRules = {};
	config.forEach((item) => {
		if (item.rules) {
			rules[item.field] = item.rules;
		}
	});
	return rules;
};
