import type { RouteRecordRaw } from "vue-router";
import { AppLayout } from "@/layouts";

export const errorRoutes: RouteRecordRaw[] = [
	{
		path: "/error",
		name: "ErrorLayout",
		component: AppLayout,
		props: { preset: "blank" },
		children: [
			{
				path: "404",
				name: "NotFound",
				component: () => import("@/views/error/NotFound.vue"),
				meta: {
					title: "404",
				},
			},
			{
				path: "403",
				name: "ForbiddenView",
				component: () => import("@/views/error/ForbiddenView.vue"),
				meta: {
					title: "403",
				},
			},
		],
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: "/error/404",
	},
];
