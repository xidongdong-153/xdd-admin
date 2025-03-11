<template>
	<el-dialog
		:title="formType === 'create' ? '新建权限' : '编辑权限'"
		:model-value="visible"
		@update:model-value="handleClose"
		width="500px"
		destroy-on-close
	>
		<el-form
			ref="formRef"
			:model="formData"
			:rules="formRules"
			label-width="100px"
			class="permission-form"
			@submit.prevent
		>
			<el-form-item label="权限编码" prop="code">
				<el-input v-model="formData.code" placeholder="请输入权限编码" />
			</el-form-item>

			<el-form-item label="权限名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入权限名称" />
			</el-form-item>

			<el-form-item label="模块名称" prop="module">
				<el-input v-model="formData.module" placeholder="请输入模块名称" />
			</el-form-item>

			<el-form-item label="操作名称" prop="action">
				<el-input v-model="formData.action" placeholder="请输入操作名称" />
			</el-form-item>

			<el-form-item label="描述" prop="description">
				<el-input
					v-model="formData.description"
					type="textarea"
					:rows="3"
					placeholder="请输入描述"
				/>
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="handleClose">取消</el-button>
			<el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useRequest } from "@/hooks/useRequest";
import { PermissionApi } from "@/api/modules/permission/permission-api";
import type { CreatePermission, PermissionInfo } from "@/api/modules/permission/types";

const props = defineProps<{
	visible: boolean;
	formType: "create" | "edit";
	permissionData?: PermissionInfo;
}>();

const emit = defineEmits<{
	"update:visible": [value: boolean];
	success: [];
}>();

// 表单引用
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive<Partial<CreatePermission>>({
	code: "",
	name: "",
	module: "",
	action: "",
	description: "",
});

// 表单验证规则
const formRules: FormRules = {
	code: [
		{ required: true, message: "请输入权限编码", trigger: "blur" },
		{ min: 3, message: "权限编码不能少于3个字符", trigger: "blur" },
	],
	name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
	module: [{ required: true, message: "请输入模块名称", trigger: "blur" }],
	action: [{ required: true, message: "请输入操作名称", trigger: "blur" }],
	description: [{ required: false, message: "请输入描述", trigger: "blur" }],
};

// 创建权限请求
const { run: createPermission, loading: createLoading } = useRequest(
	PermissionApi.create,
	undefined,
	{
		onSuccess: () => {
			ElMessage.success("创建成功");
			handleSuccess();
		},
		onError: (error) => {
			ElMessage.error(error.message || "创建失败");
		},
	},
);

// 更新权限请求
const { run: updatePermission, loading: updateLoading } = useRequest(
	PermissionApi.update,
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

// 初始化表单数据
watchEffect(() => {
	if (props.visible) {
		if (props.formType === "edit" && props.permissionData) {
			const { code, name, module, action, description } = props.permissionData;
			Object.assign(formData, { code, name, module, action, description });
		} else {
			Object.assign(formData, {
				code: "",
				name: "",
				module: "",
				action: "",
				description: "",
			});
		}
	}
});

// 处理提交
const handleSubmit = async () => {
	if (!formRef.value) return;

	try {
		await formRef.value.validate();
		if (props.formType === "create") {
			await createPermission(formData as CreatePermission);
		} else if (props.permissionData) {
			const updateData = {
				code: formData.code,
				name: formData.name,
				module: formData.module,
				action: formData.action,
				description: formData.description,
			} as Partial<PermissionInfo>;
			await updatePermission(props.permissionData.id, updateData);
		}
	} catch (error) {
		// 表单验证错误会在界面上显示，这里不需要处理
		console.error("Form validation failed:", error);
	}
};

// 处理成功
const handleSuccess = () => {
	emit("success");
	handleClose();
};

// 处理关闭
const handleClose = () => {
	emit("update:visible", false);
};
</script>

<style scoped>
.permission-form :deep(.el-form-item:last-child) {
	margin-bottom: 0;
}
</style>
