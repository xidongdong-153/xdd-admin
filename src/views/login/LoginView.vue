<template>
	<div class="login-container">
		<div class="login-box">
			<!-- 标题 -->
			<h2 class="title">
				<el-icon class="logo-icon"><Platform /></el-icon>
				XDD Admin
			</h2>

			<!-- 登录表单 -->
			<el-form ref="formRef" :model="loginForm" :rules="loginRules" class="login-form" size="large">
				<el-form-item prop="credential">
					<el-input
						v-model="loginForm.credential"
						placeholder="请输入用户名/邮箱"
						:prefix-icon="User"
					/>
				</el-form-item>

				<el-form-item prop="password">
					<el-input
						v-model="loginForm.password"
						type="password"
						placeholder="请输入密码"
						:prefix-icon="Lock"
						show-password
						@keyup.enter="handleLogin"
					/>
				</el-form-item>

				<el-form-item class="form-footer">
					<el-button :loading="loading" type="primary" class="login-button" @click="handleLogin">
						{{ loading ? "登录中..." : "登 录" }}
					</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton } from "element-plus";
import { Platform, User, Lock } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { AuthApi } from "@/api/modules/auth/auth-api";
import type { LoginData } from "@/api/modules/auth/types";
import { useRequest } from "@/hooks/useRequest";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();
const formRef = ref<FormInstance>();

// 登录表单数据
const loginForm = reactive<LoginData>({
	credential: "",
	password: "",
});

// 表单验证规则
const loginRules = {
	credential: [
		{ required: true, message: "请输入用户名/邮箱", trigger: "blur" },
		{ min: 3, message: "长度不能小于3个字符", trigger: "blur" },
	],
	password: [
		{ required: true, message: "请输入密码", trigger: "blur" },
		{ min: 6, message: "密码不能小于6个字符", trigger: "blur" },
	],
};

// 登录请求
const { run: login, loading } = useRequest(AuthApi.login, undefined, {
	onSuccess: (data) => {
		// 设置token
		authStore.setToken(data.accessToken, data.refreshToken);
		userStore.getUserInfo();
		ElMessage.success("登录成功");

		// 获取重定向地址
		const redirect = route.query.redirect as string;
		router.replace(redirect || "/");
	},
	onError: (error) => {
		ElMessage.error(error.message || "登录失败");
	},
});

// 显示过期消息
onMounted(() => {
	const message = route.query.message;
	if (message && typeof message === "string") {
		ElMessage.warning(message);
	}
});

// 处理登录
const handleLogin = async () => {
	if (!formRef.value) return;

	try {
		loading.value = true;
		await formRef.value.validate();
		await login(loginForm);
	} catch (error) {
		// 表单验证错误会在界面上显示，这里不需要处理
		console.error("Login failed:", error);
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped lang="scss">
.login-container {
	@apply flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600;

	.login-box {
		@apply w-96 rounded-lg bg-white p-8 shadow-2xl;
		animation: fadeInUp 0.5s ease-out;

		.title {
			@apply mb-8 flex items-center justify-center text-2xl font-bold text-gray-800;

			.logo-icon {
				@apply mr-2 text-blue-500;
			}
		}

		.login-form {
			.login-button {
				@apply w-full;
			}
		}
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
