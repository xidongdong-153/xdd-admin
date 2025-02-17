import { markRaw } from "vue";
import type { LayoutConfig } from "../types/layout";
import LayoutHeader from "../layout/layout-header/LayoutHeader.vue";
import LayoutMain from "../layout/layout-main/LayoutMain.vue";
import LayoutSidebar from "../layout/layout-sidebar/LayoutSidebar.vue";
import LayoutFooter from "../layout/layout-footer/LayoutFooter.vue";
import TagsView from "../common/tags-view/TagsView.vue";
import BackgroundPicture from "../common/background-picture/BackgroundPicture.vue";

/**
 * 布局组件说明：
 *
 * @component LayoutHeader - 顶部导航栏组件
 * - 包含logo、导航菜单、用户信息等
 * - 支持响应式布局
 * - 可配置显示/隐藏
 *
 * @component LayoutSidebar - 侧边栏组件
 * - 包含菜单导航
 * - 支持折叠/展开
 * - 支持多级菜单
 *
 * @component LayoutFooter - 页脚组件
 * - 显示版权信息
 * - 可选的链接列表
 *
 * @component TagsView - 标签页导航组件
 * - 显示已访问的页面标签
 * - 支持关闭、刷新、快捷导航
 *
 * @component LayoutMain - 主内容区组件
 * - 路由页面的容器
 * - 支持过渡动画
 * - 自适应高度
 *
 * @component BackgroundPicture - 背景组件
 * - 可配置背景图片或颜色
 * - 支持动态效果
 */

/**
 * Admin布局预设 - 完整的管理后台布局
 *
 * @example
 * ```vue
 * <AppLayout preset="admin" />
 *
 * // 自定义配置
 * <AppLayout
 *   preset="admin"
 *   :config="{
 *     footer: { enabled: false },
 *     header: { enabled: true }
 *   }"
 * />
 * ```
 */
export const adminPreset: LayoutConfig = {
	header: { enabled: true, component: markRaw(LayoutHeader) },
	sidebar: { enabled: true, component: markRaw(LayoutSidebar) },
	footer: { enabled: true, component: markRaw(LayoutFooter) },
	tags: { enabled: true, component: markRaw(TagsView) },
	main: { enabled: true, component: markRaw(LayoutMain) },
	background: { enabled: true, component: markRaw(BackgroundPicture) },
};

/**
 * 空白布局预设 - 最小化布局，只包含主内容区
 *
 * @description
 * 适用于登录页、错误页等不需要完整布局的页面
 *
 * @example
 * ```vue
 * <AppLayout preset="blank" />
 *
 * // 自定义配置
 * <AppLayout
 *   preset="blank"
 *   :config="{
 *     main: { enabled: true },
 *     background: { enabled: true }
 *   }"
 * />
 * ```
 */
export const blankPreset: LayoutConfig = {
	header: { enabled: false, component: null },
	sidebar: { enabled: false, component: null },
	footer: { enabled: false, component: null },
	tags: { enabled: false, component: null },
	main: { enabled: true, component: markRaw(LayoutMain) },
	background: { enabled: false, component: null },
};

/**
 * 获取预设布局配置
 *
 * @param preset - 预设名称："admin" | "blank"
 * @returns 对应的布局配置
 * @default "admin" - 默认返回管理后台布局
 *
 * @example
 * ```ts
 * // 获取管理后台预设
 * const adminConfig = getPresetConfig("admin");
 *
 * // 获取空白预设
 * const blankConfig = getPresetConfig("blank");
 *
 * // 无效预设名称时返回默认预设（admin）
 * const defaultConfig = getPresetConfig("invalid");
 * ```
 */
export const getPresetConfig = (preset: string): LayoutConfig => {
	const presets: Record<string, LayoutConfig> = {
		admin: adminPreset,
		blank: blankPreset,
	};
	return presets[preset] || adminPreset;
};
