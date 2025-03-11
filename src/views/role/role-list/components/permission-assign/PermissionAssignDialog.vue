<template>
	<el-dialog
		:title="`分配权限 - ${roleData?.name}`"
		:model-value="visible"
		@update:model-value="handleVisibleChange"
		width="800px"
		destroy-on-close
	>
		<div class="flex h-[500px] gap-4">
			<!-- 左侧：权限模块树 -->
			<div class="w-1/3 rounded border p-4">
				<el-tree
					ref="moduleTreeRef"
					:data="moduleTreeData"
					:props="{ label: 'name' }"
					node-key="name"
					highlight-current
					@node-click="handleModuleSelect"
				/>
			</div>

			<!-- 右侧：权限列表 -->
			<div class="flex flex-1 flex-col gap-4 rounded border p-4" v-loading="loadingPermissions">
				<div class="flex items-center gap-2">
					<el-input
						v-model="searchKeyword"
						placeholder="搜索权限名称/编码"
						clearable
						@input="handleSearch"
					>
						<template #prefix>
							<el-icon><Search /></el-icon>
						</template>
					</el-input>
				</div>
				<div class="flex-1 overflow-y-auto">
					<el-checkbox-group v-model="selectedPermissions" class="flex flex-col gap-2">
						<el-checkbox
							v-for="permission in filteredPermissions"
							:key="permission.id"
							:value="permission.id"
						>
							<div class="flex flex-col">
								<div class="flex items-center gap-2">
									<span class="font-medium">{{ permission.name }}</span>
									<el-tag size="small">{{ permission.code }}</el-tag>
								</div>
								<div class="text-sm text-gray-500">{{ permission.description }}</div>
							</div>
						</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
		</div>

		<template #footer>
			<div class="flex justify-end gap-2">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { useRequest } from "@/hooks/useRequest";
import { RoleApi } from "@/api/modules/role/role-api";
import { PermissionApi } from "@/api/modules/permission/permission-api";
import type { RoleInfo } from "@/api/modules/role/types";
import type { PermissionInfo } from "@/api/modules/permission/types";
import type { ElTree } from "element-plus";

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

// 权限列表
const permissions = ref<PermissionInfo[]>([]);
const selectedPermissions = ref<number[]>([]);

// 模块树引用
const moduleTreeRef = ref<InstanceType<typeof ElTree>>();

// 保存状态
const saving = ref(false);

// 获取权限列表
const { run: fetchPermissions, loading: loadingPermissions } = useRequest(
	() => PermissionApi.getList({ page: 1, limit: 1000 }),
	undefined,
	{
		onSuccess: (res) => {
			permissions.value = res.items;
			// 如果有角色数据，设置已选中的权限
			if (props.roleData) {
				selectedPermissions.value = props.roleData.permissions.map((p) => p.id);
			}
		},
		onError: (error) => {
			ElMessage.error(error.message || "获取权限列表失败");
		},
	},
);

// 构建模块树数据
const moduleTreeData = computed(() => {
	const modules = new Set(permissions.value.map((p) => p.module));
	return Array.from(modules).map((module) => ({
		name: module,
		children: [],
	}));
});

// 根据搜索关键字和选中模块过滤权限列表
const currentModule = ref<string>();
const filteredPermissions = computed(() => {
	return permissions.value.filter((permission) => {
		const matchModule = !currentModule.value || permission.module === currentModule.value;
		const matchKeyword =
			!searchKeyword.value ||
			permission.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
			permission.code.toLowerCase().includes(searchKeyword.value.toLowerCase());
		return matchModule && matchKeyword;
	});
});

// 监听对话框显示状态
watch(
	() => props.visible,
	(visible) => {
		if (visible) {
			fetchPermissions();
		} else {
			// 重置状态
			searchKeyword.value = "";
			currentModule.value = undefined;
			selectedPermissions.value = [];
			moduleTreeRef.value?.setCurrentKey(undefined);
		}
	},
);

// 处理模块选择
const handleModuleSelect = (data: { name: string }) => {
	currentModule.value = data.name;
};

// 处理搜索
const handleSearch = () => {
	// 搜索时清除模块筛选
	currentModule.value = undefined;
	moduleTreeRef.value?.setCurrentKey(undefined);
};

// 处理保存
const handleSave = async () => {
	if (!props.roleData) return;

	try {
		saving.value = true;
		await RoleApi.assignPermissions(props.roleData.id, {
			permissions: selectedPermissions.value,
		});
		ElMessage.success("保存成功");
		emit("success");
		handleCancel();
	} catch (error) {
		ElMessage.error(error instanceof Error ? error.message : "保存失败");
	} finally {
		saving.value = false;
	}
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
