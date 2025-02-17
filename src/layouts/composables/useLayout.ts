import { ref, computed, type Component, type Ref, type ComputedRef } from "vue";
import type {
	LayoutConfig,
	LayoutComponentConfig,
	LayoutThemeConfig,
	LayoutPreset,
} from "../types/layout";
import { getPresetConfig } from "../presets";

/**
 * 深度合并布局配置
 */
const mergeLayoutConfig = (preset: LayoutConfig, initial?: Partial<LayoutConfig>): LayoutConfig => {
	if (!initial) return preset;

	const result = { ...preset };
	(Object.keys(initial) as Array<keyof LayoutConfig>).forEach((key) => {
		if (initial[key]) {
			result[key] = {
				...preset[key],
				...initial[key],
			};
		}
	});

	return result;
};

/**
 * 布局组合式函数
 */
const useLayout = (
	preset: LayoutPreset = "admin",
	initialConfig?: Partial<LayoutConfig>,
): {
	layoutConfig: Ref<LayoutConfig>;
	themeConfig: Ref<LayoutThemeConfig>;
	headerComponent: ComputedRef<Component | null>;
	sidebarComponent: ComputedRef<Component | null>;
	footerComponent: ComputedRef<Component | null>;
	tagsComponent: ComputedRef<Component | null>;
	mainComponent: ComputedRef<Component | null>;
	backgroundComponent: ComputedRef<Component | null>;
	updateConfig: (key: keyof LayoutConfig, config: Partial<LayoutComponentConfig>) => void;
	updateTheme: (config: Partial<LayoutThemeConfig>) => void;
} => {
	// 布局配置
	const layoutConfig = ref<LayoutConfig>(mergeLayoutConfig(getPresetConfig(preset), initialConfig));

	// 主题配置
	const themeConfig = ref<LayoutThemeConfig>({
		darkMode: false,
		compact: false,
	});

	// 获取组件
	const getComponent = (key: keyof LayoutConfig) => {
		const config = layoutConfig.value[key];
		return config.enabled ? config.component : null;
	};

	// 导出计算属性
	const headerComponent = computed(() => getComponent("header"));
	const sidebarComponent = computed(() => getComponent("sidebar"));
	const footerComponent = computed(() => getComponent("footer"));
	const tagsComponent = computed(() => getComponent("tags"));
	const mainComponent = computed(() => getComponent("main"));
	const backgroundComponent = computed(() => getComponent("background"));

	// 更新配置
	const updateConfig = (key: keyof LayoutConfig, config: Partial<LayoutComponentConfig>) => {
		layoutConfig.value[key] = {
			...layoutConfig.value[key],
			...config,
		};
	};

	// 更新主题
	const updateTheme = (config: Partial<LayoutThemeConfig>) => {
		themeConfig.value = {
			...themeConfig.value,
			...config,
		};
	};

	return {
		// 状态
		layoutConfig,
		themeConfig,
		// 计算属性
		headerComponent,
		sidebarComponent,
		footerComponent,
		tagsComponent,
		mainComponent,
		backgroundComponent,
		// 方法
		updateConfig,
		updateTheme,
	};
};

export { useLayout };
