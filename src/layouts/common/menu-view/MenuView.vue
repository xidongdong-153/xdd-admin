<template>
	<el-menu
		style="--el-menu-bg-color: transparent"
		:mode="props.mode"
		:collapse="props.collapsed"
		:collapse-transition="false"
		:default-active="activeMenu"
		class="!border-none"
	>
		<SidebarItem
			v-for="menu in filteredMenus"
			:key="menu.id"
			:menu="menu"
			@menu-click="handleMenuClick"
		/>
	</el-menu>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, withDefaults } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { MenuViewProps, MenuItem } from "@/layouts/types";
import { ElMenu } from "element-plus";
import { SidebarItem } from "@/layouts";

const props = withDefaults(defineProps<MenuViewProps>(), {
	mode: "vertical",
	collapsed: false,
});

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => route.path);

// 基础菜单结构
const menus = ref<MenuItem[]>([
	{
		id: "dashboard",
		path: "/dashboard",
	},
	{
		id: "article",
		path: "/article",
		children: [
			{
				id: "article-list",
				path: "/article/list",
			},
			{
				id: "article-category",
				path: "/article/category",
			},
			{
				id: "article-tag",
				path: "/article/tag",
			},
		],
	},
	{
		id: "user",
		path: "/user",
		children: [
			{
				id: "user-list",
				path: "/user/list",
			},
		],
	},
	{
		id: "role",
		path: "/role",
		children: [
			{
				id: "role-list",
				path: "/role/list",
			},
		],
	},
	{
		id: "permission",
		path: "/permission",
		children: [
			{
				id: "permission-list",
				path: "/permission/list",
			},
		],
	},
	{
		id: "about",
		path: "/about",
	},
]);

const userRoles = ["admin"];

// 将路由信息合并到菜单中
const mergeRouteMetaToMenu = (menu: MenuItem): MenuItem => {
	const route = router.getRoutes().find((r) => r.path === menu.path);
	if (route) {
		menu.meta = route.meta;
	}

	if (menu.children?.length) {
		menu.children = menu.children.map(mergeRouteMetaToMenu);
	}

	return menu;
};

const filterMenus = (items: MenuItem[]): MenuItem[] => {
	return items
		.filter((item) => {
			// 过滤掉隐藏的菜单
			if (item.meta?.hidden) return false;

			// 如果有子菜单，递归过滤
			if (item.children?.length) {
				item.children = filterMenus(item.children);
				// 如果子菜单都被过滤掉了，也过滤掉父菜单
				return item.children.length > 0;
			}
			return true;
		})
		.filter((item) => {
			// 角色过滤
			if (item.meta?.roles && !item.meta.roles.some((role) => userRoles.includes(role))) {
				return false;
			}
			return true;
		});
};

const filteredMenus = computed(() => {
	const menusWithMeta = menus.value.map(mergeRouteMetaToMenu);
	return filterMenus(menusWithMeta);
});

const handleMenuClick = (menu: MenuItem) => {
	if (menu.path) {
		router.push(menu.path);
	}
};
</script>
