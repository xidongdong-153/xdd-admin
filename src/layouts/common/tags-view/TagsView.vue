<template>
	<div
		class="flex h-9 items-center space-x-2 border-b border-gray-200/60 bg-white px-4 pt-1 !transition-colors !duration-300 dark:border-gray-700/60 dark:bg-gray-900"
	>
		<div
			v-for="tag in visitedViews"
			:key="tag.path"
			:class="[
				'flex h-full cursor-pointer items-center space-x-1 rounded-t-lg border border-b-0 px-3 dark:border-gray-700',
				isActive(tag)
					? 'bg-blue-500 text-white hover:bg-blue-400 dark:border-blue-500/60'
					: 'border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
			]"
			@click="handleTagClick(tag)"
		>
			<span>{{ tag.title }}</span>

			<el-icon @click.stop="closeTag(tag)">
				<Close />
			</el-icon>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElIcon } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface TagView {
	title: string;
	path: string;
}

const route = useRoute();
const router = useRouter();

// 访问过的页面标签
const visitedViews = ref<TagView[]>([{ title: "仪表盘", path: "/dashboard" }]);

// 添加标签
const addTag = (tag: TagView) => {
	if (!visitedViews.value.some((v) => v.path === tag.path)) {
		visitedViews.value.push(tag);
	}
};

// 关闭标签
const closeTag = (tag: TagView) => {
	const index = visitedViews.value.findIndex((v) => v.path === tag.path);
	if (index > -1) {
		visitedViews.value.splice(index, 1);

		// 如果关闭的是当前页，跳转到最后一个标签
		if (isActive(tag)) {
			const lastTag = visitedViews.value[visitedViews.value.length - 1];
			if (lastTag) {
				router.push(lastTag.path);
			}
		}

		console.log("Tag closed:", tag.path); // 输出关闭标签
	}
};

// 处理标签点击
const handleTagClick = (tag: TagView) => {
	router.push(tag.path);
	console.log("Tag clicked:", tag.path); // 输出点击标签
};

// 判断标签是否激活
const isActive = (tag: TagView) => {
	return tag.path === route.path;
};

// 监听路由变化，添加新标签
watch(
	() => route.path,
	(path) => {
		addTag({
			title: (route.meta.title as string) || "未命名页面",
			path,
		});
		console.log("New tag added:", path); // 输出新增标签
	},
	{ immediate: true },
);
</script>
