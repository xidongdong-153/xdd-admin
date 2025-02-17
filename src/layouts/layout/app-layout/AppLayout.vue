<template>
	<div class="relative flex h-screen flex-col" :class="{ 'is-compact': themeConfig.compact }">
		<!-- 背景 -->
		<component :is="backgroundComponent" v-if="backgroundComponent" />

		<!-- 头部 -->
		<component :is="headerComponent" v-if="headerComponent" />

		<div class="flex flex-1 overflow-hidden">
			<!-- 侧边栏 -->
			<component :is="sidebarComponent" v-if="sidebarComponent" />

			<div class="flex flex-1 flex-col overflow-hidden">
				<!-- 标签栏 -->
				<component :is="tagsComponent" v-if="tagsComponent" />

				<!-- 主内容区 -->
				<component :is="mainComponent" v-if="mainComponent" />

				<!-- 页脚 -->
				<component :is="footerComponent" v-if="footerComponent" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useLayout } from "@/layouts/composables/useLayout";
import type { LayoutProps } from "@/layouts/types/layout";

// 定义组件属性
const props = withDefaults(defineProps<LayoutProps>(), {
	preset: "admin",
	config: () => ({}),
	theme: () => ({}),
});

// 使用布局组合式函数
const {
	themeConfig,
	headerComponent,
	sidebarComponent,
	footerComponent,
	tagsComponent,
	mainComponent,
	backgroundComponent,
	updateTheme,
} = useLayout(props.preset, props.config);

// 监听主题变化
watch(
	() => props.theme,
	(newTheme) => {
		if (newTheme) {
			updateTheme(newTheme);
		}
	},
	{ deep: true },
);
</script>
