<template>
	<div class="flex h-full flex-col gap-4">
		<!-- 工具栏 -->
		<div class="flex items-center justify-end">
			<div class="flex items-center gap-2">
				<el-button type="primary" @click="handleCreate">
					<template #icon>
						<el-icon><Plus /></el-icon>
					</template>
					新增
				</el-button>
			</div>
		</div>

		<!-- 表格区域 -->
		<el-table
			v-loading="loading"
			:data="tableData"
			border
			stripe
			style="width: 100%"
			class="flex-1"
		>
			<el-table-column prop="id" label="ID" width="80" />
			<el-table-column prop="username" label="用户名" width="120" />
			<el-table-column prop="nickname" label="昵称" width="120" />
			<el-table-column prop="email" label="邮箱" min-width="200" />
			<el-table-column prop="phoneNumber" label="手机号码" width="120" />
			<el-table-column prop="status" label="状态" width="100">
				<template #default="{ row }">
					<el-tag :type="getUserStatusType(row.status)" size="small">
						{{ getUserStatusLabel(row.status) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="lastLoginAt" label="最后登录时间" width="180">
				<template #default="{ row }">
					{{ row.lastLoginAt ? formatDate(row.lastLoginAt) : "-" }}
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="200">
				<template #default="{ row }">
					<el-button link type="primary" @click="handleView(row)">查看</el-button>
					<el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
					<el-button link type="danger" @click="handleDelete(row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页区域 -->
		<div class="flex justify-end">
			<el-pagination
				v-model:current-page="pagination.page"
				v-model:page-size="pagination.limit"
				:total="pagination.total"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>

		<!-- 用户表单对话框 -->
		<UserForm
			v-model:visible="formVisible"
			:form-type="formType"
			:user-data="currentUser"
			@success="handleFormSuccess"
		/>

		<!-- 用户详情对话框 -->
		<UserDetail v-model:visible="detailVisible" :user-data="currentUser" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { TagProps } from "element-plus";
import { useRequest } from "@/hooks/useRequest";
import { UserApi } from "@/api/modules/user/user-api";
import type { UserInfo, UserListRequest } from "@/api/modules/user/types";
import type { ApiError } from "@/api/core/types";
import { UserStatus } from "@/api/modules/user/types";
import UserForm from "../user-form/UserForm.vue";
import UserDetail from "../user-detail/UserDetail.vue";

// 表格数据
const tableData = ref<UserInfo[]>([]);

// 分页参数
const pagination = reactive({
	page: 1,
	limit: 10,
	total: 0,
});

// 搜索参数
const searchParams = ref<Partial<UserListRequest>>({});

// 表单控制
const formVisible = ref(false);
const formType = ref<"create" | "edit">("create");
const currentUser = ref<UserInfo>();

// 详情对话框控制
const detailVisible = ref(false);

// 获取用户列表数据
const { run: fetchUserList, loading } = useRequest(UserApi.getList, undefined, {
	onSuccess: (res) => {
		tableData.value = res.items;
		pagination.total = res.meta.totalItems;
	},
	onError: (error) => {
		ElMessage.error(error.message || "获取用户列表失败");
	},
});

// 刷新列表数据
const refreshList = () => {
	const params: UserListRequest = {
		page: pagination.page,
		limit: pagination.limit,
		...searchParams.value,
	};
	fetchUserList(params);
};

// 处理搜索
const handleSearch = (params: Partial<UserListRequest>) => {
	searchParams.value = params;
	pagination.page = 1; // 重置页码
	refreshList();
};

// 处理分页大小变化
const handleSizeChange = (size: number) => {
	pagination.limit = size;
	refreshList();
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
	pagination.page = page;
	refreshList();
};

// 处理新建
const handleCreate = () => {
	formType.value = "create";
	currentUser.value = undefined;
	formVisible.value = true;
};

// 处理编辑
const handleEdit = (row: UserInfo) => {
	formType.value = "edit";
	currentUser.value = row;
	formVisible.value = true;
};

// 处理删除
const handleDelete = async (row: UserInfo) => {
	try {
		await ElMessageBox.confirm(`确认删除用户 "${row.nickname}" 吗？`, "删除确认", {
			type: "warning",
		});
		await UserApi.delete(row.id);
		ElMessage.success("删除成功");
		refreshList();
	} catch (error) {
		// 用户取消删除时不显示错误
		if (error !== "cancel") {
			ElMessage.error("删除失败");
		}
	}
};

// 处理表单提交成功
const handleFormSuccess = () => {
	refreshList();
};

// 获取用户状态标签
const getUserStatusLabel = (status: UserStatus) => {
	const statusMap: Record<UserStatus, string> = {
		[UserStatus.Active]: "正常",
		[UserStatus.Inactive]: "未激活",
		[UserStatus.Locked]: "已锁定",
		[UserStatus.PendingVerification]: "待验证",
		[UserStatus.Suspended]: "已停用",
	};
	return statusMap[status] || status;
};

// 获取用户状态对应的Tag类型
const getUserStatusType = (status: UserStatus): TagProps["type"] => {
	const typeMap: Record<UserStatus, TagProps["type"]> = {
		[UserStatus.Active]: "success",
		[UserStatus.Inactive]: "info",
		[UserStatus.Locked]: "danger",
		[UserStatus.PendingVerification]: "warning",
		[UserStatus.Suspended]: "danger",
	};
	return typeMap[status] || "info";
};

// 格式化日期
const formatDate = (date: string) => {
	return new Date(date).toLocaleString("zh-CN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

// 处理查看详情
const handleView = async (row: UserInfo) => {
	try {
		const response = await UserApi.getDetail(row.id);
		currentUser.value = response.data.data;
		detailVisible.value = true;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		ElMessage.error(apiError.message || "获取用户详情失败");
	}
};

// 暴露方法给父组件
defineExpose({
	handleSearch,
	refreshList,
});
</script>
