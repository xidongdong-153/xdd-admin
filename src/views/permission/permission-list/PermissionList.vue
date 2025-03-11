<template>
	<div class="flex h-full w-full flex-col gap-4">
		<!-- 顶部搜索组件 -->
		<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
			<SearchForm @search="handleSearch" @reset="handleReset" />
		</div>

		<!-- 权限列表表格组件 -->
		<div class="flex-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
			<DataTable ref="dataTableRef" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SearchForm, DataTable } from "./components";
import type { PermissionListRequest } from "@/api/modules/permission/types";

// 表格组件引用
const dataTableRef = ref<InstanceType<typeof DataTable>>();

// 组件挂载后加载数据
onMounted(() => {
	dataTableRef.value?.refreshList();
});

// 搜索处理
const handleSearch = (params: Partial<PermissionListRequest>) => {
	dataTableRef.value?.handleSearch(params);
};

// 重置处理
const handleReset = () => {
	dataTableRef.value?.handleSearch({});
};
</script>
