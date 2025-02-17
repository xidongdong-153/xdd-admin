import type { RouteRecordRaw } from "vue-router";

export const settingRoutes: RouteRecordRaw[] = [
	{
		path: "setting",
		name: "SettingView",
		component: () => import("views/setting/SettingView.vue"),
		meta: {
			title: "系统设置",
			icon: "setting",
			roles: ["admin"],
			cache: false,
		},
	},
];
