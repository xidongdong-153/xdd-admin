import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/prompt-template",
		name: "PromptTemplate",
		component: () => import("@/views/prompt-template/prompt-list/PromptList.vue"),
		meta: {
			title: "AI提问模板",
			icon: "ChatDotRound",
			requiresAuth: false,
		},
	},
];

export default routes;
