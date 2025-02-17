<template>
	<div
		class="flex h-full flex-col border-r border-gray-200/60 bg-white !transition-all !duration-300 dark:border-gray-700/60 dark:bg-gray-900"
		:class="[collapsed ? 'w-16' : 'w-64']"
	>
		<el-scrollbar>
			<MenuView :collapsed="collapsed" />
		</el-scrollbar>
		<div
			class="flex h-14 w-full cursor-pointer items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
			@click="toggleSidebar"
		>
			<el-icon v-if="collapsed">
				<Expand />
			</el-icon>
			<el-icon v-else>
				<Fold />
			</el-icon>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElScrollbar, ElIcon } from "element-plus";
import { Expand, Fold } from "@element-plus/icons-vue";
import { MenuView } from "@/layouts";

const collapsed = ref(false);

const toggleSidebar = () => {
	collapsed.value = !collapsed.value;
};
</script>
