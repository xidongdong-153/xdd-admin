import type { RouteRecordRaw } from "vue-router";

export const roleRoutes: RouteRecordRaw[] = [
	{
		path: "role",
		name: "role",
		redirect: "/role/list",
		meta: {
			title: "角色管理",
			icon: "Paperclip",
			roles: ["admin", "editor"],
		},
		children: [
			{
				path: "list",
				name: "roleList",
				component: () => import("views/role/role-list/RoleList.vue"),
				meta: {
					title: "角色列表",
					icon: "List",
					cache: true,
				},
			},
			{
				path: "edit/:id?",
				name: "roleEdit",
				component: () => import("views/role/role-edit/RoleEdit.vue"),
				meta: {
					title: "编辑角色",
					icon: "",
					cache: false,
					hidden: true,
				},
			},
		],
	},
];
