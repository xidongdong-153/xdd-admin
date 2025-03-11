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
			<el-form-item label="用户名">
				<el-input v-model="formData.username" placeholder="请输入用户名" clearable />
			</el-form-item>

			<el-form-item label="邮箱">
				<el-input v-model="formData.email" placeholder="请输入邮箱" clearable />
			</el-form-item>

			<el-form-item label="状态">
				<el-select v-model="formData.status" placeholder="请选择状态" clearable>
					<el-option
						v-for="option in statusOptions"
						:key="option.value"
						:label="option.label"
						:value="option.value"
					/>
				</el-select>
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
import type { UserListRequest } from "@/api/modules/user/types";
import { UserStatus } from "@/api/modules/user/types";

// 用户状态选项
const statusOptions = [
	{ value: UserStatus.Active, label: "正常" },
	{ value: UserStatus.Inactive, label: "未激活" },
	{ value: UserStatus.Locked, label: "已锁定" },
	{ value: UserStatus.PendingVerification, label: "待验证" },
	{ value: UserStatus.Suspended, label: "已停用" },
];

// 定义表单数据
const formData = reactive<Partial<UserListRequest>>({
	username: "",
	email: "",
	status: undefined,
});

// 定义 emit 事件
const emit = defineEmits<{
	search: [params: Partial<UserListRequest>];
	reset: [];
}>();

// 搜索处理
const handleSearch = () => {
	emit("search", { ...formData });
};

// 重置处理
const handleReset = () => {
	formData.username = "";
	formData.email = "";
	formData.status = undefined;
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
