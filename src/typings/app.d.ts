/// <reference types="vue-router" />

declare namespace App {
	namespace Global {
		/**
		 * 菜单项类型
		 */
		interface MenuItem {
			/**
			 * 菜单项唯一标识
			 */
			id: string;
			/**
			 * 路由路径
			 */
			path: string;
			/**
			 * 子菜单
			 */
			children?: MenuItem[];
			/**
			 * 菜单元数据
			 */
			meta?: import("vue-router").RouteMeta;
		}
	}
}
