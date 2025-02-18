import { createRouter, createWebHistory, type Router } from "vue-router";
import { AppLayout } from "@/layouts";
import {
	articleRoutes,
	dashboardRoutes,
	errorRoutes,
	loginRoutes,
	permissionRoutes,
	settingRoutes,
	userRoutes,
	roleRoutes,
	aboutRoutes,
} from "./modules";
import { setupGuards } from "./guards";
import type { RouteRecordRaw } from "vue-router";
import promptTemplateRoutes from "./modules/prompt-template";

const rootRoute = {
	path: "/",
	component: AppLayout,
	props: {
		preset: "admin",
		config: {
			footer: { enabled: false },
		},
	},
	redirect: "/dashboard",
	children: [
		...dashboardRoutes,
		...settingRoutes,
		...userRoutes,
		...articleRoutes,
		...roleRoutes,
		...permissionRoutes,
		...aboutRoutes,
		...promptTemplateRoutes,
	],
};

const routes: RouteRecordRaw[] = [...loginRoutes, rootRoute, ...errorRoutes];

const router: Router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

// 设置路由守卫
setupGuards(router);

export default router;

export * from "./types";
