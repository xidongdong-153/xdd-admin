<template>
	<el-dialog
		:title="formType === 'create' ? '新建用户' : '编辑用户'"
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
			class="user-form"
			@submit.prevent
		>
			<el-form-item label="用户名" prop="username">
				<el-input v-model="formData.username" placeholder="请输入用户名" />
			</el-form-item>

			<el-form-item label="昵称" prop="nickname">
				<el-input v-model="formData.nickname" placeholder="请输入昵称" />
			</el-form-item>

			<el-form-item label="邮箱" prop="email">
				<el-input v-model="formData.email" placeholder="请输入邮箱" />
			</el-form-item>

			<el-form-item label="手机号码" prop="phoneNumber">
				<el-input v-model="formData.phoneNumber" placeholder="请输入手机号码" />
			</el-form-item>

			<el-form-item
				label="密码"
				prop="password"
				:required="formType === 'create'"
				v-if="formType === 'create'"
			>
				<el-input
					v-model="formData.password"
					type="password"
					placeholder="请输入密码"
					show-password
				/>
			</el-form-item>

			<el-form-item label="状态" prop="status" v-if="formType === 'edit'">
				<el-select v-model="formData.status" placeholder="请选择状态">
					<el-option
						v-for="item in statusOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
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
import { UserApi } from "@/api/modules/user/user-api";
import type { CreateUser, UpdateUserRequest, UserInfo } from "@/api/modules/user/types";
import { UserStatus } from "@/api/modules/user/types";

const props = defineProps<{
	visible: boolean;
	formType: "create" | "edit";
	userData?: UserInfo;
}>();

const emit = defineEmits<{
	"update:visible": [value: boolean];
	success: [];
}>();

// 表单引用
const formRef = ref<FormInstance>();

// 用户状态选项
const statusOptions = [
	{ value: UserStatus.Active, label: "正常" },
	{ value: UserStatus.Inactive, label: "未激活" },
	{ value: UserStatus.Locked, label: "已锁定" },
	{ value: UserStatus.PendingVerification, label: "待验证" },
	{ value: UserStatus.Suspended, label: "已停用" },
];

// 表单数据
const formData = reactive<Partial<CreateUser & UpdateUserRequest>>({
	username: "",
	nickname: "",
	email: "",
	phoneNumber: "",
	password: "",
	status: undefined,
});

// 表单验证规则
const formRules: FormRules = {
	username: [
		{ required: true, message: "请输入用户名", trigger: "blur" },
		{ min: 3, message: "用户名不能少于3个字符", trigger: "blur" },
	],
	nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
	email: [
		{ required: true, message: "请输入邮箱", trigger: "blur" },
		{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
	],
	phoneNumber: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }],
	password: [
		{ required: props.formType === "create", message: "请输入密码", trigger: "blur" },
		{ min: 6, message: "密码不能少于6个字符", trigger: "blur" },
	],
};

// 创建用户请求
const { run: createUser, loading: createLoading } = useRequest(UserApi.create, undefined, {
	onSuccess: () => {
		ElMessage.success("创建成功");
		handleSuccess();
	},
	onError: (error) => {
		ElMessage.error(error.message || "创建失败");
	},
});

// 更新用户请求
const { run: updateUser, loading: updateLoading } = useRequest(UserApi.update, undefined, {
	onSuccess: () => {
		ElMessage.success("更新成功");
		handleSuccess();
	},
	onError: (error) => {
		ElMessage.error(error.message || "更新失败");
	},
});

// 加载状态
const loading = computed(() => createLoading.value || updateLoading.value);

// 初始化表单数据
watchEffect(() => {
	if (props.visible) {
		if (props.formType === "edit" && props.userData) {
			const { username, nickname, email, phoneNumber, status } = props.userData;
			Object.assign(formData, { username, nickname, email, phoneNumber, status });
		} else {
			Object.assign(formData, {
				username: "",
				nickname: "",
				email: "",
				phoneNumber: "",
				password: "",
				status: undefined,
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
			await createUser(formData as CreateUser);
		} else if (props.userData) {
			const updateData = {
				username: formData.username,
				nickname: formData.nickname,
				email: formData.email,
				phoneNumber: formData.phoneNumber,
				status: formData.status,
			} as Partial<UserInfo>;
			await updateUser(props.userData.id, updateData);
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
.user-form :deep(.el-form-item:last-child) {
	margin-bottom: 0;
}
</style>
