<template>
	<el-dialog
		:title="`分配用户 - ${roleData?.name}`"
		:model-value="visible"
		@update:model-value="handleVisibleChange"
		width="800px"
		destroy-on-close
	>
		<div class="flex h-[500px] gap-4">
			<!-- 左侧：可选用户列表 -->
			<div class="flex w-1/2 flex-col gap-4 rounded border p-4" v-loading="loadingAvailableUsers">
				<div class="flex items-center gap-2">
					<el-input
						v-model="searchKeyword"
						placeholder="搜索用户名/邮箱"
						clearable
						@input="handleSearch"
					>
						<template #prefix>
							<el-icon><Search /></el-icon>
						</template>
					</el-input>
				</div>
				<div class="flex-1 overflow-y-auto">
					<el-checkbox-group v-model="selectedUsers" class="flex flex-col gap-2">
						<el-checkbox
							v-for="user in availableUsers"
							:key="user.id"
							:value="user.id"
							:disabled="assignedUserIds.includes(user.id)"
						>
							<div class="flex items-center gap-2">
								<span>{{ user.username }}</span>
								<span class="text-sm text-gray-500">({{ user.email }})</span>
							</div>
						</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>

			<!-- 中间：操作按钮 -->
			<div class="flex flex-col items-center justify-center gap-4">
				<el-button type="primary" :disabled="!selectedUsers.length" @click="handleAssign">
					<template #icon>
						<el-icon><ArrowRight /></el-icon>
					</template>
					分配
				</el-button>
				<el-button type="danger" :disabled="!selectedAssignedUsers.length" @click="handleRemove">
					<template #icon>
						<el-icon><ArrowLeft /></el-icon>
					</template>
					移除
				</el-button>
			</div>

			<!-- 右侧：已分配用户列表 -->
			<div class="flex w-1/2 flex-col gap-4 rounded border p-4" v-loading="loadingAssignedUsers">
				<div class="text-base font-medium">已分配用户</div>
				<div class="flex-1 overflow-y-auto">
					<el-checkbox-group v-model="selectedAssignedUsers" class="flex flex-col gap-2">
						<el-checkbox v-for="user in assignedUsers" :key="user.id" :value="user.id">
							<div class="flex items-center gap-2">
								<span>{{ user.username }}</span>
								<span class="text-sm text-gray-500">({{ user.email }})</span>
							</div>
						</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
		</div>

		<template #footer>
			<div class="flex justify-end gap-2">
				<el-button @click="handleCancel">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Search, ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import { useRequest } from "@/hooks/useRequest";
import { RoleApi } from "@/api/modules/role/role-api";
import { UserApi } from "@/api/modules/user/user-api";
import type { RoleInfo } from "@/api/modules/role/types";
import type { UserInfo, UserListRequest } from "@/api/modules/user/types";

interface Props {
	visible: boolean;
	roleData?: RoleInfo;
}

const props = withDefaults(defineProps<Props>(), {
	visible: false,
});

const emit = defineEmits<{
	"update:visible": [value: boolean];
	success: [];
}>();

// 搜索关键字
const searchKeyword = ref("");

// 可选用户列表
const availableUsers = ref<UserInfo[]>([]);

// 已分配用户列表
const assignedUsers = ref<UserInfo[]>([]);
const assignedUserIds = computed(() => (assignedUsers.value || []).map((user) => user.id));

// 选中的用户
const selectedUsers = ref<number[]>([]);
const selectedAssignedUsers = ref<number[]>([]);

// 获取可选用户列表
const { run: fetchAvailableUsers, loading: loadingAvailableUsers } = useRequest(
	async (params: Partial<UserListRequest & { keyword?: string }>) => {
		return UserApi.getList({
			page: params.page || 1,
			limit: params.limit || 10,
			username: params.keyword,
		});
	},
	undefined,
	{
		onSuccess: (res) => {
			availableUsers.value = res.items || [];
		},
		onError: (error) => {
			ElMessage.error(error.message || "获取用户列表失败");
		},
	},
);

// 获取已分配用户列表
const { run: fetchAssignedUsers, loading: loadingAssignedUsers } = useRequest(
	async () => {
		if (!props.roleData) {
			return UserApi.getList({ page: 1, limit: 1 }); // 返回空列表
		}
		return RoleApi.getRoleUsers(props.roleData.id);
	},
	undefined,
	{
		onSuccess: (res) => {
			assignedUsers.value = res.items || [];
		},
		onError: (error) => {
			ElMessage.error(error.message || "获取已分配用户失败");
		},
	},
);

// 分配用户
const { run: assignUsers } = useRequest(
	async (userIds: number[]) => {
		if (!props.roleData) {
			throw new Error("角色数据不存在");
		}
		return RoleApi.assignUsers(props.roleData.id, { userIds });
	},
	undefined,
	{
		onSuccess: () => {
			ElMessage.success("分配成功");
			selectedUsers.value = [];
			refreshData();
			emit("success");
		},
		onError: (error) => {
			ElMessage.error(error.message || "分配失败");
		},
	},
);

// 移除用户
const { run: removeUsers } = useRequest(
	async (userIds: number[]) => {
		if (!props.roleData) {
			throw new Error("角色数据不存在");
		}
		return RoleApi.removeUsers(props.roleData.id, { userIds });
	},
	undefined,
	{
		onSuccess: () => {
			ElMessage.success("移除成功");
			selectedAssignedUsers.value = [];
			refreshData();
			emit("success");
		},
		onError: (error) => {
			ElMessage.error(error.message || "移除失败");
		},
	},
);

// 监听对话框显示状态
watch(
	() => props.visible,
	(visible) => {
		if (visible) {
			refreshData();
		} else {
			// 重置状态
			searchKeyword.value = "";
			selectedUsers.value = [];
			selectedAssignedUsers.value = [];
		}
	},
);

// 刷新数据
const refreshData = () => {
	fetchAvailableUsers({ page: 1, limit: 100 });
	fetchAssignedUsers();
};

// 处理搜索
const handleSearch = () => {
	fetchAvailableUsers({
		page: 1,
		limit: 100,
		keyword: searchKeyword.value,
	});
};

// 处理分配
const handleAssign = () => {
	if (!selectedUsers.value.length) return;
	assignUsers(selectedUsers.value);
};

// 处理移除
const handleRemove = () => {
	if (!selectedAssignedUsers.value.length) return;
	removeUsers(selectedAssignedUsers.value);
};

// 处理取消
const handleCancel = () => {
	emit("update:visible", false);
};

// 处理弹窗显示状态变化
const handleVisibleChange = (value: boolean) => {
	emit("update:visible", value);
};
</script>
