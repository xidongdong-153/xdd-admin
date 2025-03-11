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
			<el-table-column prop="name" label="角色名称" width="150" />
			<el-table-column prop="description" label="描述" min-width="200" />
			<el-table-column prop="isSystem" label="系统角色" width="100">
				<template #default="{ row }">
					<el-tag :type="row.isSystem ? 'danger' : 'info'" size="small">
						{{ row.isSystem ? "是" : "否" }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createdAt" label="创建时间" width="180">
				<template #default="{ row }">
					{{ formatDate(row.createdAt) }}
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="260">
				<template #default="{ row }">
					<el-button link type="primary" @click="handleViewDetail(row)">查看</el-button>
					<el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
					<el-button link type="primary" @click="handleAssignPermissions(row)">分配权限</el-button>
					<el-button link type="primary" @click="handleAssignUsers(row)">关联用户</el-button>
					<el-button v-if="!row.isSystem" link type="danger" @click="handleDelete(row)"
						>删除</el-button
					>
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

		<!-- 角色表单对话框 -->
		<RoleForm
			v-model:visible="formVisible"
			:form-type="formType"
			:role-data="currentRole"
			@success="handleFormSuccess"
		/>

		<!-- 用户分配对话框 -->
		<UserAssignDialog
			v-model:visible="userAssignVisible"
			:role-data="currentRole"
			@success="handleUserAssignSuccess"
		/>

		<!-- 权限分配对话框 -->
		<PermissionAssignDialog
			v-model:visible="permissionAssignVisible"
			:role-data="currentRole"
			@success="handlePermissionAssignSuccess"
		/>

		<!-- 角色详情对话框 -->
		<RoleDetailDialog v-model:visible="roleDetailVisible" :role-data="currentDetailRole" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useRequest } from "@/hooks/useRequest";
import { RoleApi } from "@/api/modules/role/role-api";
import type { RoleInfo, RoleListRequest } from "@/api/modules/role/types";
import RoleForm from "../role-form/RoleForm.vue";
import UserAssignDialog from "../user-assign/UserAssignDialog.vue";
import PermissionAssignDialog from "../permission-assign/PermissionAssignDialog.vue";
import RoleDetailDialog from "../role-detail/RoleDetailDialog.vue";

// 表格数据
const tableData = ref<RoleInfo[]>([]);

// 分页参数
const pagination = reactive({
	page: 1,
	limit: 10,
	total: 0,
});

// 搜索参数
const searchParams = ref<Partial<RoleListRequest>>({});

// 表单控制
const formVisible = ref(false);
const formType = ref<"create" | "edit">("create");
const currentRole = ref<RoleInfo>();

// 用户分配对话框控制
const userAssignVisible = ref(false);

// 权限分配对话框控制
const permissionAssignVisible = ref(false);

// 角色详情对话框控制
const roleDetailVisible = ref(false);
const currentDetailRole = ref<RoleInfo>();

// 获取角色列表数据
const { run: fetchRoleList, loading } = useRequest(RoleApi.getList, undefined, {
	onSuccess: (res) => {
		tableData.value = res.items;
		pagination.total = res.meta.totalItems;
	},
	onError: (error) => {
		ElMessage.error(error.message || "获取角色列表失败");
	},
});

// 刷新列表数据
const refreshList = () => {
	const params: RoleListRequest = {
		page: pagination.page,
		limit: pagination.limit,
		...searchParams.value,
	};
	fetchRoleList(params);
};

// 处理搜索
const handleSearch = (params: Partial<RoleListRequest>) => {
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
	currentRole.value = undefined;
	formVisible.value = true;
};

// 处理编辑
const handleEdit = (row: RoleInfo) => {
	formType.value = "edit";
	currentRole.value = row;
	formVisible.value = true;
};

// 处理删除
const handleDelete = async (row: RoleInfo) => {
	try {
		await ElMessageBox.confirm(`确认删除角色 "${row.name}" 吗？`, "删除确认", {
			type: "warning",
		});
		await RoleApi.delete(row.id);
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

// 处理分配用户
const handleAssignUsers = (row: RoleInfo) => {
	currentRole.value = row;
	userAssignVisible.value = true;
};

// 处理用户分配成功
const handleUserAssignSuccess = () => {
	refreshList();
};

// 处理分配权限
const handleAssignPermissions = (row: RoleInfo) => {
	currentRole.value = row;
	permissionAssignVisible.value = true;
};

// 处理权限分配成功
const handlePermissionAssignSuccess = () => {
	refreshList();
};

// 处理查看详情
const handleViewDetail = async (row: RoleInfo) => {
	try {
		const response = await RoleApi.getDetail(row.id);
		currentDetailRole.value = response.data.data;
		roleDetailVisible.value = true;
	} catch {
		ElMessage.error("获取角色详情失败");
	}
};

// 暴露方法给父组件
defineExpose({
	handleSearch,
	refreshList,
});
</script>
