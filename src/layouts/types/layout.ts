import type { Component } from "vue";

/**
 * 布局组件配置接口
 */
export interface LayoutComponentConfig {
	/** 是否启用该组件 */
	enabled: boolean;
	/** 组件实例 */
	component: Component | null;
}

/**
 * 布局配置接口
 */
export interface LayoutConfig {
	/** 头部配置 */
	header: LayoutComponentConfig;
	/** 侧边栏配置 */
	sidebar: LayoutComponentConfig;
	/** 页脚配置 */
	footer: LayoutComponentConfig;
	/** 标签页配置 */
	tags: LayoutComponentConfig;
	/** 主内容区配置 */
	main: LayoutComponentConfig;
	/** 背景配置 */
	background: LayoutComponentConfig;
}

/**
 * 布局预设类型
 */
export type LayoutPreset = "admin" | "blank" | "custom";

/**
 * 布局主题配置
 */
export interface LayoutThemeConfig {
	/** 主题色 */
	primaryColor?: string;
	/** 暗黑模式 */
	darkMode?: boolean;
	/** 紧凑模式 */
	compact?: boolean;
}

/**
 * 布局属性接口
 */
export interface LayoutProps {
	/** 布局预设 */
	preset?: LayoutPreset;
	/** 布局配置 */
	config?: Partial<LayoutConfig>;
	/** 主题配置 */
	theme?: LayoutThemeConfig;
}
