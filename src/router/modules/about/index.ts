import type { RouteRecordRaw } from "vue-router";

export const aboutRoutes: RouteRecordRaw[] = [
	{
		path: "about",
		name: "AboutView",
		component: () => import("views/about/AboutView.vue"),
		meta: {
			title: "关于",
			icon: "Opportunity",
			roles: ["admin"],
			cache: false,
		},
	},
];
