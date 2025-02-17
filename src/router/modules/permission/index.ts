import type { RouteRecordRaw } from "vue-router";

export const permissionRoutes: RouteRecordRaw[] = [
	{
		path: "permission",
		name: "permission",
		redirect: "/permission/list",
		meta: {
			title: "权限管理",
			icon: "MagicStick",
			roles: ["admin", "editor"],
		},
		children: [
			{
				path: "list",
				name: "permissionList",
				component: () => import("views/permission/permission-list/PermissionList.vue"),
				meta: {
					title: "权限列表",
					icon: "List",
					cache: true,
				},
			},
			{
				path: "edit/:id?",
				name: "permissionEdit",
				component: () => import("views/permission/permission-edit/PermissionEdit.vue"),
				meta: {
					title: "编辑权限",
					icon: "",
					cache: false,
					hidden: true,
				},
			},
		],
	},
];
