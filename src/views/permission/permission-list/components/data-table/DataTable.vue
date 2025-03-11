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
			<el-table-column prop="code" label="权限编码" width="150" />
			<el-table-column prop="name" label="权限名称" />
			<el-table-column prop="module" label="模块名称" width="120" />
			<el-table-column prop="action" label="操作名称" width="120" />
			<el-table-column prop="createdAt" label="创建时间" width="180">
				<template #default="{ row }">
					{{ formatDate(row.createdAt) }}
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

		<!-- 权限表单对话框 -->
		<PermissionForm
			v-model:visible="formVisible"
			:form-type="formType"
			:permission-data="currentPermission"
			@success="handleFormSuccess"
		/>

		<!-- 权限详情对话框 -->
		<PermissionDetail v-model:visible="detailVisible" :permission-data="currentPermission" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useRequest } from "@/hooks/useRequest";
import { PermissionApi } from "@/api/modules/permission/permission-api";
import type { PermissionInfo, PermissionListRequest } from "@/api/modules/permission/types";
import type { ApiError } from "@/api/core/types";
import PermissionForm from "../permission-form/PermissionForm.vue";
import PermissionDetail from "../permission-detail/PermissionDetail.vue";

// 表格数据
const tableData = ref<PermissionInfo[]>([]);

// 分页参数
const pagination = reactive({
	page: 1,
	limit: 10,
	total: 0,
});

// 搜索参数
const searchParams = ref<Partial<PermissionListRequest>>({});

// 表单控制
const formVisible = ref(false);
const formType = ref<"create" | "edit">("create");
const currentPermission = ref<PermissionInfo>();

// 详情对话框控制
const detailVisible = ref(false);

// 获取权限列表数据
const { run: fetchPermissionList, loading } = useRequest(PermissionApi.getList, undefined, {
	onSuccess: (res) => {
		tableData.value = res.items;
		pagination.total = res.meta.totalItems;
	},
	onError: (error) => {
		ElMessage.error(error.message || "获取权限列表失败");
	},
});

// 刷新列表数据
const refreshList = () => {
	const params: PermissionListRequest = {
		page: pagination.page,
		limit: pagination.limit,
		...searchParams.value,
	};
	fetchPermissionList(params);
};

// 处理搜索
const handleSearch = (params: Partial<PermissionListRequest>) => {
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
	currentPermission.value = undefined;
	formVisible.value = true;
};

// 处理编辑
const handleEdit = (row: PermissionInfo) => {
	formType.value = "edit";
	currentPermission.value = row;
	formVisible.value = true;
};

// 处理删除
const handleDelete = async (row: PermissionInfo) => {
	try {
		await ElMessageBox.confirm(`确认删除权限 "${row.name}" 吗？`, "删除确认", {
			type: "warning",
		});
		await PermissionApi.delete(row.id);
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

// 处理查看详情
const handleView = async (row: PermissionInfo) => {
	try {
		const response = await PermissionApi.getDetail(row.id);
		currentPermission.value = response.data.data;
		detailVisible.value = true;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		ElMessage.error(apiError.message || "获取权限详情失败");
	}
};

// 暴露方法给父组件
defineExpose({
	handleSearch,
	refreshList,
});
</script>
