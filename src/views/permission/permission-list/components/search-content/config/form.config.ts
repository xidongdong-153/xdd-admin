import type { SearchForm } from "../types";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import {
	FormItemType,
	type FormItemConfig,
	type FormConfig,
} from "@/components/business/search-list/types";
import type { CreatePermission } from "@/api/modules/permission/types";
import type { FormRules } from "element-plus";

// 默认表单数据
export const defaultSearchForm: SearchForm = {
	code: "",
	module: "",
};

// 搜索表单配置
export const getFormConfig = (): FormItemConfig[] => [
	{
		field: "code",
		label: "权限编码",
		type: FormItemType.INPUT,
		placeholder: "请输入权限编码",
		icon: ElementPlusIconsVue.Key,
		span: 8,
		rules: [
			{
				min: 2,
				message: "权限编码至少2个字符",
				trigger: "blur",
			},
		],
	},
	{
		field: "module",
		label: "模块名称",
		type: FormItemType.INPUT,
		placeholder: "请输入模块名称",
		icon: ElementPlusIconsVue.Folder,
		span: 8,
		rules: [
			{
				min: 2,
				message: "模块名称至少2个字符",
				trigger: "blur",
			},
		],
	},
];

// 新增权限表单配置
export const getCreateFormConfig = (): FormConfig<CreatePermission> => ({
	fields: [
		{
			field: "code",
			label: "权限编码",
			type: FormItemType.INPUT,
			placeholder: "请输入权限编码",
			icon: ElementPlusIconsVue.Key,
			rules: [
				{
					required: true,
					message: "请输入权限编码",
					trigger: "blur",
				},
				{
					min: 2,
					message: "权限编码至少2个字符",
					trigger: "blur",
				},
			],
		},
		{
			field: "name",
			label: "权限名称",
			type: FormItemType.INPUT,
			placeholder: "请输入权限名称",
			icon: ElementPlusIconsVue.Document,
			rules: [
				{
					required: true,
					message: "请输入权限名称",
					trigger: "blur",
				},
				{
					min: 2,
					message: "权限名称至少2个字符",
					trigger: "blur",
				},
			],
		},
		{
			field: "description",
			label: "权限描述",
			type: FormItemType.INPUT,
			placeholder: "请输入权限描述",
			icon: ElementPlusIconsVue.InfoFilled,
			rules: [
				{
					required: true,
					message: "请输入权限描述",
					trigger: "blur",
				},
				{
					min: 2,
					message: "权限描述至少2个字符",
					trigger: "blur",
				},
			],
		},
		{
			field: "module",
			label: "模块名称",
			type: FormItemType.INPUT,
			placeholder: "请输入模块名称",
			icon: ElementPlusIconsVue.Folder,
			rules: [
				{
					required: true,
					message: "请输入模块名称",
					trigger: "blur",
				},
				{
					min: 2,
					message: "模块名称至少2个字符",
					trigger: "blur",
				},
			],
		},
		{
			field: "action",
			label: "操作名称",
			type: FormItemType.INPUT,
			placeholder: "请输入操作名称",
			icon: ElementPlusIconsVue.Operation,
			rules: [
				{
					required: true,
					message: "请输入操作名称",
					trigger: "blur",
				},
				{
					min: 2,
					message: "操作名称至少2个字符",
					trigger: "blur",
				},
			],
		},
	],
	rules: {
		code: [
			{
				required: true,
				message: "请输入权限编码",
				trigger: "blur",
			},
			{
				min: 2,
				message: "权限编码至少2个字符",
				trigger: "blur",
			},
		],
		name: [
			{
				required: true,
				message: "请输入权限名称",
				trigger: "blur",
			},
			{
				min: 2,
				message: "权限名称至少2个字符",
				trigger: "blur",
			},
		],
		description: [
			{
				required: true,
				message: "请输入权限描述",
				trigger: "blur",
			},
			{
				min: 2,
				message: "权限描述至少2个字符",
				trigger: "blur",
			},
		],
		module: [
			{
				required: true,
				message: "请输入模块名称",
				trigger: "blur",
			},
			{
				min: 2,
				message: "模块名称至少2个字符",
				trigger: "blur",
			},
		],
		action: [
			{
				required: true,
				message: "请输入操作名称",
				trigger: "blur",
			},
			{
				min: 2,
				message: "操作名称至少2个字符",
				trigger: "blur",
			},
		],
	},
	width: "500px",
});

// 生成验证规则
export const generateRules = (formConfig: FormItemConfig[]): FormRules => {
	const rules: FormRules = {};
	formConfig.forEach((item) => {
		if (item.rules) {
			rules[item.field as string] = item.rules;
		}
	});
	return rules;
};
