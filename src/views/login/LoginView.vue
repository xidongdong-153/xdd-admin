<template>
	<div class="login-container">
		<div class="login-box">
			<!-- 标题 -->
			<div class="mb-8 flex items-center justify-between">
				<h2 class="title">
					<el-icon class="logo-icon"><Platform /></el-icon>
					XDD Admin
				</h2>

				<!-- 主题切换按钮 -->
				<button class="theme-toggle-btn" @click="toggleDark()">
					<el-icon><Moon v-if="isDark" /><Sunny v-else /></el-icon>
				</button>
			</div>

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
import { Platform, User, Lock, Moon, Sunny } from "@element-plus/icons-vue";
import { useDark, useToggle } from "@vueuse/core";
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

// 暗黑模式切换
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<style scoped lang="scss">
.login-container {
	@apply relative flex min-h-screen w-full items-center justify-center overflow-hidden transition-all duration-300;
	/* 明亮模式渐变 */
	@apply bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600;
	/* 暗黑模式渐变 */
	@apply dark:bg-gradient-to-r dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900;
	/* 添加动态背景纹理 */
	background-size: 200% 200%;
	animation: gradientMove 15s ease infinite;

	/* 添加背景光效 */
	&::before {
		content: "";
		@apply absolute h-full w-full;
		background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
		animation: pulseLight 8s ease-in-out infinite;
	}

	.login-box {
		@apply relative w-96 rounded-2xl p-8 transition-all duration-300;
		/* 高级磨砂玻璃效果 */
		@apply bg-white/30 dark:bg-gray-800/30;
		@apply backdrop-blur-xl;
		/* 渐变边框 */
		@apply border border-transparent;
		background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2)),
			linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
		background-origin: border-box;
		background-clip: padding-box, border-box;
		/* 优化阴影效果 */
		@apply shadow-[0_8px_32px_0_rgba(31,38,135,0.37)];
		@apply dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)];
		/* 添加光晕效果 */
		&::before {
			content: "";
			@apply absolute -inset-0.5 rounded-2xl opacity-0;
			background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.3), transparent 70%);
			animation: glowEffect 3s ease-in-out infinite;
		}
		animation: fadeInUp 0.5s ease-out;

		.title {
			@apply flex items-center text-2xl font-bold text-gray-800 transition-all duration-300;
			@apply dark:text-gray-100;

			.logo-icon {
				@apply mr-2 text-blue-500 transition-all duration-300;
				@apply dark:text-blue-400;
			}
		}

		.theme-toggle-btn {
			@apply rounded-lg p-2 text-gray-600 transition-all duration-300;
			@apply hover:bg-gray-100/80 hover:text-gray-900;
			@apply dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-gray-100;
		}

		.login-form {
			/* 移除浏览器自动填充的背景色 */
			:deep(input) {
				&:-webkit-autofill,
				&:-webkit-autofill:hover,
				&:-webkit-autofill:focus,
				&:-webkit-autofill:active {
					-webkit-box-shadow: 0 0 0 1000px transparent inset !important;
					box-shadow: 0 0 0 1000px transparent inset !important;
					-webkit-text-fill-color: var(--el-text-color-primary) !important;
					background-color: transparent !important;
					background-clip: content-box !important;
					transition: background-color 9999999s ease-in-out 0s;
				}
			}

			/* 确保输入框背景色跟随主题 */
			:deep(.el-input__wrapper) {
				@apply border-0 backdrop-blur-md transition-all duration-300;
				@apply bg-white/40 dark:bg-gray-800/40;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;

				&:hover,
				&:focus-within {
					@apply bg-white/60 dark:bg-gray-800/60;
					box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15) !important;
				}

				/* 处理自动填充时的背景色 */
				&.is-focus {
					@apply bg-white/60 dark:bg-gray-800/60 !important;
				}

				/* 输入框内容区域样式 */
				:deep(.el-input__inner) {
					@apply bg-transparent transition-colors duration-300;
					color: var(--el-text-color-primary);

					&::placeholder {
						color: var(--el-text-color-placeholder);
					}
				}
			}

			.login-button {
				@apply relative overflow-hidden;
				&::before {
					content: "";
					@apply absolute inset-0 opacity-0;
					background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
					animation: buttonShine 3s ease-in-out infinite;
				}
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

/* 添加背景渐变动画 */
@keyframes gradientMove {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

/* 添加新的动画关键帧 */
@keyframes pulseLight {
	0%,
	100% {
		opacity: 0.8;
	}
	50% {
		opacity: 0.4;
	}
}

@keyframes glowEffect {
	0%,
	100% {
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
}

@keyframes buttonShine {
	0% {
		transform: translateX(-100%);
		opacity: 0;
	}
	50% {
		opacity: 0.5;
	}
	100% {
		transform: translateX(100%);
		opacity: 0;
	}
}
</style>
