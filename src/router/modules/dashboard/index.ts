import type { RouteRecordRaw } from "vue-router";

export const dashboardRoutes: RouteRecordRaw[] = [
	{
		path: "dashboard",
		name: "Dashboard",
		component: () => import("views/dashboard/DashboardView.vue"),
		meta: {
			title: "仪表盘",
			icon: "House",
			cache: true,
			roles: ["admin", "editor"],
		},
	},
];
