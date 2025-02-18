import type { PaginationQuery } from "@/api/core/types";
import type { FormItemRule } from "element-plus";
import type { Component, VNode } from "vue";
import type { PaginatedData, HttpResponse } from "@/api/core/types";

// 定义表单类型
type SearchForm<T = Record<string, InputValue | SelectValue | DateValue>> = T;

// 分页配置类型
interface Pagination extends PaginationQuery {
	total: number;
}

// 表单项类型
export enum FormItemType {
	INPUT = "input",
	SELECT = "select",
	DATE_PICKER = "datePicker",
}

// 表单项验证规则
type FormRule = FormItemRule;

// 选项配置
interface SelectOption {
	label: string;
	value: string | number;
}

// 表单项配置
interface FormItemConfig<T = SearchForm> {
	/**
	 * 字段名
	 */
	field: keyof T;

	/**
	 * 标签名
	 */
	label: string;

	/**
	 * 表单项类型
	 */
	type: FormItemType;

	/**
	 * 占位符
	 */
	placeholder?: string;

	/**
	 * 选项（用于select类型）
	 */
	options?: SelectOption[];

	/**
	 * 验证规则
	 */
	rules?: FormRule[];

	/**
	 * 栅格占比
	 */
	span?: number;

	/**
	 * 图标组件
	 */
	icon?: Component;

	/**
	 * 值类型
	 */
	valueType?: FormItemValueMap[FormItemType];
}

// 表单项值类型
type InputValue = string | number;
type SelectValue = string | number;
type DateValue = Date | string | number;

type FormItemValueMap = {
	[FormItemType.INPUT]: InputValue;
	[FormItemType.SELECT]: SelectValue;
	[FormItemType.DATE_PICKER]: DateValue;
};

type FormItemValue = FormItemValueMap[FormItemType];

/**
 * 列配置
 */
interface ColumnConfig<T> {
	/** 字段名 */
	prop: keyof T;
	/** 显示标签 */
	label: string;
	/** 是否可见 */
	visible: boolean;
	/** 宽度 */
	width?: number;
	/** 是否固定列 */
	fixed?: "left" | "right";
	/** 自定义渲染函数 */
	render?: (row: T) => VNode | string;
}

/**
 * 操作按钮配置
 */
interface ActionButton<T> {
	/** 按钮文本 */
	label: string;
	/** 按钮类型 */
	type?: "primary" | "success" | "warning" | "danger" | "info";
	/** 权限标识 */
	permission?: string;
	/** 点击回调 */
	onClick: (row: T) => void;
	/** 是否显示按钮 */
	show?: (row: T) => boolean;
}

/**
 * API 方法接口
 */
interface ApiMethods<T, Q extends PaginationQuery, C = T> {
	/** 获取列表 */
	getList: (params: Q) => Promise<HttpResponse<PaginatedData<T>>>;
	/** 删除记录 */
	delete?: (id: number) => Promise<HttpResponse<T>>;
	/** 新增记录 */
	create?: (data: C) => Promise<HttpResponse<T>>;
	/** 更新记录 */
	update?: (id: number, data: Partial<T>) => Promise<HttpResponse<T>>;
}

/**
 * 工具栏配置
 */
interface ToolbarConfig {
	/** 是否显示新增按钮 */
	showAdd?: boolean;
	/** 是否显示刷新按钮 */
	showRefresh?: boolean;
	/** 是否显示列设置 */
	showColumnSetting?: boolean;
}

/**
 * 内容列表配置
 */
interface ContentListConfig<T extends { id: number }, Q extends PaginationQuery, C = T> {
	/** 列配置 */
	columns: ColumnConfig<T>[];
	/** API 方法 */
	api: ApiMethods<T, Q, C>;
	/** 查询参数 */
	queryParams: Q;
	/** 操作按钮 */
	actions?: ActionButton<T>[];
	/** 工具栏配置 */
	toolbar?: ToolbarConfig;
	/** 表单配置 */
	formConfig?: FormConfig<C>;
	/** 是否显示操作列 */
	showActions?: boolean;
}

/**
 * 表单配置
 */
interface FormConfig<T> {
	/** 表单字段配置 */
	fields: FormItemConfig<T>[];
	/** 表单验证规则 */
	rules?: Record<keyof T, FormRule[]>;
	/** 表单宽度 */
	width?: string | number;
}

export type {
	SearchForm,
	Pagination,
	FormRule,
	SelectOption,
	FormItemConfig,
	FormItemValue,
	InputValue,
	SelectValue,
	DateValue,
	FormItemValueMap,
	ColumnConfig,
	ActionButton,
	ApiMethods,
	ToolbarConfig,
	ContentListConfig,
	FormConfig,
};
