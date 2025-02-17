import type { SearchForm } from "../types";
import type { FormRules } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { FormItemType, type FormItemConfig } from "@/components/business/search-list/types";

// 默认表单数据
export const defaultSearchForm: SearchForm = {
	name: "",
	description: "",
};

// 表单配置
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
	{
		field: "description",
		label: "角色描述",
		type: FormItemType.INPUT,
		placeholder: "请输入角色描述",
		icon: ElementPlusIconsVue.Document,
		span: 8,
		rules: [
			{
				min: 2,
				message: "角色描述至少2个字符",
				trigger: "blur",
			},
		],
	},
];

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
