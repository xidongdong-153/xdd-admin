<template>
	<el-dialog
		title="权限详情"
		:model-value="visible"
		@update:model-value="handleClose"
		width="600px"
		destroy-on-close
	>
		<el-descriptions :column="2" border>
			<el-descriptions-item label="权限编码">{{ permissionData?.code }}</el-descriptions-item>
			<el-descriptions-item label="权限名称">{{ permissionData?.name }}</el-descriptions-item>
			<el-descriptions-item label="模块名称">{{ permissionData?.module }}</el-descriptions-item>
			<el-descriptions-item label="操作名称">{{ permissionData?.action }}</el-descriptions-item>
			<el-descriptions-item label="创建时间" :span="2">
				{{ permissionData?.createdAt ? formatDate(permissionData.createdAt) : "-" }}
			</el-descriptions-item>
			<el-descriptions-item label="更新时间" :span="2">
				{{ permissionData?.updatedAt ? formatDate(permissionData.updatedAt) : "-" }}
			</el-descriptions-item>
			<el-descriptions-item label="描述" :span="2">
				{{ permissionData?.description || "-" }}
			</el-descriptions-item>
			<el-descriptions-item label="关联角色" :span="2">
				<div v-if="permissionData?.roles?.length" class="flex flex-wrap gap-2">
					<el-tag
						v-for="role in permissionData.roles"
						:key="role.id"
						type="success"
						effect="light"
						class="mr-2"
					>
						{{ role.name }}
						<el-tooltip v-if="role.description" :content="role.description" placement="top">
							<el-icon class="ml-1"><InfoFilled /></el-icon>
						</el-tooltip>
					</el-tag>
				</div>
				<span v-else>暂无关联角色</span>
			</el-descriptions-item>
		</el-descriptions>

		<template #footer>
			<el-button @click="handleClose">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { InfoFilled } from "@element-plus/icons-vue";
import type { PermissionInfo } from "@/api/modules/permission/types";

defineProps<{
	visible: boolean;
	permissionData?: PermissionInfo;
}>();

const emit = defineEmits<{
	"update:visible": [value: boolean];
}>();

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

// 处理关闭
const handleClose = () => {
	emit("update:visible", false);
};
</script>
