<template>
	<el-dialog
		title="用户详情"
		:model-value="visible"
		@update:model-value="handleClose"
		width="600px"
		destroy-on-close
	>
		<el-descriptions :column="2" border>
			<el-descriptions-item label="用户名">{{ userData?.username }}</el-descriptions-item>
			<el-descriptions-item label="昵称">{{ userData?.nickname }}</el-descriptions-item>
			<el-descriptions-item label="邮箱">{{ userData?.email }}</el-descriptions-item>
			<el-descriptions-item label="手机号码">{{
				userData?.phoneNumber || "-"
			}}</el-descriptions-item>
			<el-descriptions-item label="状态">
				<el-tag :type="getUserStatusType(userData?.status)" size="small">
					{{ getUserStatusLabel(userData?.status) }}
				</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="最后登录">
				{{ userData?.lastLoginAt ? formatDate(userData.lastLoginAt) : "-" }}
			</el-descriptions-item>
			<el-descriptions-item label="创建时间" :span="2">
				{{ userData?.createdAt ? formatDate(userData.createdAt) : "-" }}
			</el-descriptions-item>
			<el-descriptions-item label="关联角色" :span="2">
				<div v-if="userData?.roles?.length" class="flex flex-wrap gap-2">
					<el-tag
						v-for="role in userData.roles"
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
import type { TagProps } from "element-plus";
import { UserStatus } from "@/api/modules/user/types";
import type { UserInfo } from "@/api/modules/user/types";

defineProps<{
	visible: boolean;
	userData?: UserInfo;
}>();

const emit = defineEmits<{
	"update:visible": [value: boolean];
}>();

// 获取用户状态标签
const getUserStatusLabel = (status?: UserStatus) => {
	if (!status) return "-";
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
const getUserStatusType = (status?: UserStatus): TagProps["type"] => {
	if (!status) return "info";
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

// 处理关闭
const handleClose = () => {
	emit("update:visible", false);
};
</script>
