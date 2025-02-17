import { AppLayout } from "@/layouts";
import type { RouteRecordRaw } from "vue-router";

export const loginRoutes: RouteRecordRaw[] = [
	{
		path: "/login",
		name: "Login",
		component: () => import("views/login/LoginView.vue"),
		meta: {
			title: "登录",
			layout: AppLayout,
			props: { preset: "blank" },
		},
	},
];
