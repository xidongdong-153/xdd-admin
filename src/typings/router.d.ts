import "vue-router";

// 扩展 Vue Router 的 RouteMeta 类型
declare module "vue-router" {
	export interface RouteMeta {
		/**
		 * 路由标题
		 */
		title?: string;
		/**
		 * 图标
		 */
		icon?: string;
		/**
		 * 角色
		 */
		roles?: string[];
		/**
		 * 页面缓存
		 */
		cache?: boolean;
		/**
		 * 页面权限
		 */
		permissions?: string[];
		/**
		 * 是否在菜单中隐藏
		 */
		hidden?: boolean;
	}
}
