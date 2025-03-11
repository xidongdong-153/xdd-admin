<template>
	<el-form
		:model="formData"
		size="default"
		label-position="right"
		label-width="80px"
		class="search-form"
	>
		<!-- 搜索条件区域 -->
		<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<el-form-item label="角色名称">
				<el-input v-model="formData.name" placeholder="请输入角色名称" clearable />
			</el-form-item>
		</div>

		<!-- 按钮区域 -->
		<div class="mt-4 flex justify-center gap-2 sm:justify-end">
			<el-button type="primary" @click="handleSearch">搜索</el-button>
			<el-button @click="handleReset">重置</el-button>
		</div>
	</el-form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { RoleListRequest } from "@/api/modules/role/types";

// 定义表单数据
const formData = reactive<Partial<RoleListRequest>>({
	name: "",
});

// 定义 emit 事件
const emit = defineEmits<{
	search: [params: Partial<RoleListRequest>];
	reset: [];
}>();

// 搜索处理
const handleSearch = () => {
	emit("search", { ...formData });
};

// 重置处理
const handleReset = () => {
	formData.name = "";
	emit("reset");
};
</script>

<style scoped>
.search-form :deep(.el-form-item) {
	margin-bottom: 0;
}

.search-form :deep(.el-input),
.search-form :deep(.el-select) {
	width: 100%;
}
</style>
