<template>
	<el-dialog
		v-model="dialogVisible"
		title="角色详情"
		width="800px"
		:close-on-click-modal="false"
		destroy-on-close
	>
		<el-descriptions :column="2" border>
			<el-descriptions-item label="角色ID" width="180px">
				{{ roleData?.id }}
			</el-descriptions-item>
			<el-descriptions-item label="角色编码">
				{{ roleData?.code }}
			</el-descriptions-item>
			<el-descriptions-item label="角色名称">
				{{ roleData?.name }}
			</el-descriptions-item>
			<el-descriptions-item label="系统角色">
				<el-tag :type="roleData?.isSystem ? 'danger' : 'info'" size="small">
					{{ roleData?.isSystem ? "是" : "否" }}
				</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="创建时间">
				{{ formatDate(roleData?.createdAt) }}
			</el-descriptions-item>
			<el-descriptions-item label="更新时间">
				{{ formatDate(roleData?.updatedAt) }}
			</el-descriptions-item>
			<el-descriptions-item label="角色描述" :span="2">
				{{ roleData?.description || "暂无描述" }}
			</el-descriptions-item>
		</el-descriptions>

		<div class="mt-4">
			<h3 class="mb-2 text-base font-medium">关联权限</h3>
			<el-table
				:data="groupedPermissions"
				border
				stripe
				style="width: 100%"
				:span-method="handleSpanMethod"
				row-key="id"
			>
				<el-table-column prop="module" label="所属模块" width="150">
					<template #default="{ row }">
						<el-tag type="primary" class="w-full text-center">
							{{ row.module }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="权限名称" width="180" />
				<el-table-column prop="code" label="权限编码" width="180" />
				<el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
			</el-table>
		</div>

		<template #footer>
			<el-button @click="handleClose">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { RoleInfo } from "@/api/modules/role/types";
import type { TableColumnCtx } from "element-plus";

const props = defineProps<{
	visible: boolean;
	roleData?: RoleInfo;
}>();

const emit = defineEmits<{
	"update:visible": [value: boolean];
}>();

const dialogVisible = computed({
	get: () => props.visible,
	set: (value) => emit("update:visible", value),
});

const handleClose = () => {
	dialogVisible.value = false;
};

const formatDate = (date?: string) => {
	if (!date) return "-";
	return new Date(date).toLocaleString("zh-CN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

type PermissionWithSpan = RoleInfo["permissions"][0] & {
	_spanCount: number;
};

const groupedPermissions = computed(() => {
	if (!props.roleData?.permissions) return [];

	// 按模块和名称排序
	return [...props.roleData.permissions].sort((a, b) => {
		// 首先按模块排序
		const moduleCompare = a.module.localeCompare(b.module);
		if (moduleCompare !== 0) return moduleCompare;
		// 同模块内按名称排序
		return a.name.localeCompare(b.name);
	});
});

const handleSpanMethod = ({
	row,
	column,
	rowIndex,
}: {
	row: PermissionWithSpan;
	column: TableColumnCtx<PermissionWithSpan>;
	rowIndex: number;
}) => {
	if (column.property === "module") {
		if (rowIndex === 0 || row.module !== groupedPermissions.value[rowIndex - 1].module) {
			let count = 1;
			for (let i = rowIndex + 1; i < groupedPermissions.value.length; i++) {
				if (groupedPermissions.value[i].module === row.module) {
					count++;
				} else {
					break;
				}
			}
			return {
				rowspan: count,
				colspan: 1,
			};
		} else {
			return {
				rowspan: 0,
				colspan: 0,
			};
		}
	}
};
</script>
