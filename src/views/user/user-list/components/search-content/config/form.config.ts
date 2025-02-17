import type { SearchForm } from "../types";
import { UserStatus } from "../types";
import type { FormRules } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { FormItemType, type FormItemConfig } from "@/components/business/search-list/types";

// 默认表单数据
export const defaultSearchForm: SearchForm = {
	username: "",
	email: "",
	status: "",
};

// 表单配置
export const getFormConfig = (): FormItemConfig[] => [
	{
		field: "username",
		label: "用户名",
		type: FormItemType.INPUT,
		placeholder: "请输入用户名",
		icon: ElementPlusIconsVue.User,
		span: 8,
		rules: [
			{
				min: 2,
				message: "用户名至少2个字符",
				trigger: "blur",
			},
		],
	},
	{
		field: "email",
		label: "邮箱",
		type: FormItemType.INPUT,
		placeholder: "请输入邮箱",
		icon: ElementPlusIconsVue.Message,
		span: 8,
		rules: [
			{
				type: "email",
				message: "请输入正确的邮箱格式",
				trigger: ["blur", "change"],
			},
		],
	},
	{
		field: "status",
		label: "状态",
		type: FormItemType.SELECT,
		placeholder: "请选择状态",
		span: 8,
		options: [
			{ value: "", label: "全部" },
			{ value: UserStatus.ACTIVE, label: "启用" },
			{ value: UserStatus.INACTIVE, label: "禁用" },
			{ value: UserStatus.LOCKED, label: "锁定" },
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
