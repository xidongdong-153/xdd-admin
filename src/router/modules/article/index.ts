import type { RouteRecordRaw } from "vue-router";

export const articleRoutes: RouteRecordRaw[] = [
	{
		path: "article",
		name: "Article",
		redirect: "/article/list",
		meta: {
			title: "文章管理",
			icon: "Edit",
			roles: ["admin", "editor"],
		},
		children: [
			{
				path: "list",
				name: "ArticleList",
				component: () => import("views/article/article-list/ArticleList.vue"),
				meta: {
					title: "文章列表",
					icon: "List",
					cache: true,
				},
			},
			{
				path: "edit/:id?",
				name: "ArticleEdit",
				component: () => import("views/article/article-edit/ArticleEdit.vue"),
				meta: {
					title: "编辑文章",
					icon: "",
					cache: false,
					hidden: true,
				},
			},
			{
				path: "category",
				name: "Category",
				component: () => import("views/article/category/CategoryView.vue"),
				meta: {
					title: "分类管理",
					icon: "Collection",
					cache: true,
				},
			},
			{
				path: "tag",
				name: "TagManager",
				component: () => import("views/article/tag/TagView.vue"),
				meta: {
					title: "标签管理",
					icon: "CollectionTag",
					cache: true,
				},
			},
		],
	},
];
