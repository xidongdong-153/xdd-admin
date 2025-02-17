import type { RouteRecordRaw } from "vue-router";

export const userRoutes: RouteRecordRaw[] = [
	{
		path: "user",
		name: "user",
		redirect: "/user/list",
		meta: {
			title: "用户管理",
			icon: "User",
			roles: ["admin", "editor"],
		},
		children: [
			{
				path: "list",
				name: "UserList",
				component: () => import("@/views/user/user-list/UserList.vue"),
				meta: {
					title: "用户列表",
					icon: "List",
					cache: true,
				},
			},
		],
	},
];
