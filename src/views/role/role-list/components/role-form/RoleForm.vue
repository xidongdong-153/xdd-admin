<template>
	<el-dialog
		:title="formType === 'create' ? '新增角色' : '编辑角色'"
		:model-value="visible"
		@update:model-value="handleVisibleChange"
		width="600px"
		destroy-on-close
	>
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" @submit.prevent>
			<el-form-item label="角色编码" prop="code">
				<el-input v-model="formData.code" placeholder="请输入角色编码，例如：ROLE_ADMIN" />
			</el-form-item>
			<el-form-item label="角色名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入角色名称" />
			</el-form-item>
			<el-form-item label="父角色" prop="parentId">
				<el-input v-model="formData.parentId" placeholder="请输入父角色ID" />
			</el-form-item>
			<el-form-item label="排序值" prop="sort">
				<el-input-number v-model="formData.sort" :min="0" placeholder="请输入排序值" />
			</el-form-item>
			<el-form-item label="描述" prop="description">
				<el-input
					v-model="formData.description"
					type="textarea"
					:rows="3"
					placeholder="请输入角色描述"
				/>
			</el-form-item>
			<el-form-item label="状态">
				<el-switch v-model="formData.isEnabled" />
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="flex justify-end gap-2">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" :loading="loading" @click="handleSubmit"> 确定 </el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useRequest } from "@/hooks/useRequest";
import { RoleApi } from "@/api/modules/role/role-api";
import type { RoleInfo, CreateRole } from "@/api/modules/role/types";

interface Props {
	visible: boolean;
	formType: "create" | "edit";
	roleData?: RoleInfo;
}

const props = withDefaults(defineProps<Props>(), {
	visible: false,
});

const emit = defineEmits<{
	"update:visible": [value: boolean];
	success: [];
}>();

// 表单引用
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive<CreateRole>({
	code: "",
	name: "",
	description: "",
	parentId: undefined,
	sort: 0,
	isEnabled: true,
	isSystem: false,
	permissions: [], // 暂时使用空数组，后续可以添加权限选择功能
});

// 表单校验规则
const formRules: FormRules = {
	code: [
		{ required: true, message: "请输入角色编码", trigger: "blur" },
		{ pattern: /^[A-Z_]+$/, message: "角色编码只能包含大写字母和下划线", trigger: "blur" },
	],
	name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
	sort: [{ type: "number", min: 0, message: "排序值不能小于0", trigger: "blur" }],
};

// 监听编辑数据变化
watch(
	() => props.roleData,
	(roleData) => {
		if (roleData && props.formType === "edit") {
			formData.code = roleData.code;
			formData.name = roleData.name;
			formData.description = roleData.description;
			formData.parentId = roleData.parentId;
			formData.sort = roleData.sort;
			formData.isEnabled = roleData.isEnabled;
			formData.permissions = roleData.permissions;
		} else {
			// 新建时重置表单
			formData.code = "";
			formData.name = "";
			formData.description = "";
			formData.parentId = undefined;
			formData.sort = 0;
			formData.isEnabled = true;
			formData.permissions = [];
		}
	},
	{ immediate: true },
);

// 创建角色
const { run: createRole, loading: createLoading } = useRequest(RoleApi.create, undefined, {
	onSuccess: () => {
		ElMessage.success("创建成功");
		handleSuccess();
	},
	onError: (error) => {
		ElMessage.error(error.message || "创建失败");
	},
});

// 更新角色
const { run: updateRole, loading: updateLoading } = useRequest(
	(id: number, data: Partial<RoleInfo>) => RoleApi.update(id, data),
	undefined,
	{
		onSuccess: () => {
			ElMessage.success("更新成功");
			handleSuccess();
		},
		onError: (error) => {
			ElMessage.error(error.message || "更新失败");
		},
	},
);

// 加载状态
const loading = computed(() => createLoading.value || updateLoading.value);

// 处理提交
const handleSubmit = async () => {
	if (!formRef.value) return;

	try {
		await formRef.value.validate();
		if (props.formType === "create") {
			await createRole(formData);
		} else if (props.roleData) {
			await updateRole(props.roleData.id, formData);
		}
	} catch {
		// 表单验证失败
		return;
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

// 处理成功提交
const handleSuccess = () => {
	emit("update:visible", false);
	emit("success");
};
</script>
