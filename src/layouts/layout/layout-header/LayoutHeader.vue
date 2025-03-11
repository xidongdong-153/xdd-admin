<template>
	<header
		class="flex h-14 items-center justify-between border-b border-gray-200/60 bg-white px-4 !transition-colors !duration-300 dark:border-gray-700/60 dark:bg-gray-900"
	>
		<!-- 左侧 Logo -->
		<div class="flex items-center space-x-4">
			<div class="text-xl font-bold text-gray-800 dark:text-white">🖕 Blog Admin</div>
		</div>

		<!-- 右侧用户信息 -->
		<div class="flex items-center space-x-4">
			<!-- 主题切换 -->
			<button
				class="rounded-lg p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
				@click="toggleDark()"
			>
				<el-icon v-if="isDark"><Moon class="dark:text-white" /></el-icon>
				<el-icon v-else><Sunny class="dark:text-white" /></el-icon>
			</button>

			<!-- 用户信息下拉菜单 -->
			<el-dropdown trigger="click">
				<div class="flex cursor-pointer items-center space-x-2">
					<el-avatar
						:size="32"
						:src="'https://picx.zhimg.com/v2-211cad7e2235552d59a287a7c6f773e8_r.jpg?source=2c26e567'"
					/>
					<span class="text-gray-600 dark:text-white"> {{ userStore.userInfo?.nickname }} </span>
				</div>

				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="handleProfile">
							<el-icon><User /></el-icon>
							个人信息
						</el-dropdown-item>
						<el-dropdown-item @click="handleChangePassword">
							<el-icon><Lock /></el-icon>
							修改密码
						</el-dropdown-item>
						<el-dropdown-item @click="handleLogout">
							<el-icon><SwitchButton /></el-icon>
							退出登录
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

		<!-- 修改密码弹窗 -->
		<el-dialog
			v-model="changePasswordVisible"
			title="修改密码"
			width="500px"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form
				ref="changePasswordFormRef"
				:model="changePasswordForm"
				:rules="changePasswordRules"
				label-width="100px"
			>
				<el-form-item label="旧密码" prop="oldPassword">
					<el-input
						v-model="changePasswordForm.oldPassword"
						type="password"
						placeholder="请输入旧密码"
						show-password
					/>
				</el-form-item>
				<el-form-item label="新密码" prop="newPassword">
					<el-input
						v-model="changePasswordForm.newPassword"
						type="password"
						placeholder="请输入新密码"
						show-password
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="changePasswordVisible = false">取消</el-button>
					<el-button type="primary" @click="submitChangePassword" :loading="changePasswordLoading">
						确认
					</el-button>
				</span>
			</template>
		</el-dialog>
	</header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
	ElMessageBox,
	ElDropdown,
	ElDropdownMenu,
	ElDropdownItem,
	ElAvatar,
	ElIcon,
	ElMessage,
	ElDialog,
	ElForm,
	ElFormItem,
	ElInput,
	ElButton,
} from "element-plus";
import { Moon, Sunny, User, SwitchButton, Lock } from "@element-plus/icons-vue";
import { useDark, useToggle } from "@vueuse/core";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import { UserApi } from "@/api/modules/user/user-api";
import type { ChangePasswordRequest } from "@/api/modules/user/types";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

// 修改密码相关
const changePasswordVisible = ref(false);
const changePasswordLoading = ref(false);
const changePasswordFormRef = ref<FormInstance>();
const changePasswordForm = ref<ChangePasswordRequest>({
	oldPassword: "",
	newPassword: "",
});

const changePasswordRules = {
	oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
	newPassword: [
		{ required: true, message: "请输入新密码", trigger: "blur" },
		{ min: 8, message: "密码长度不能小于8位", trigger: "blur" },
		{
			pattern: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
			message: "密码必须包含大小写字母、数字或特殊字符",
			trigger: "blur",
		},
	],
};

const handleChangePassword = () => {
	changePasswordVisible.value = true;
};

const submitChangePassword = async () => {
	if (!changePasswordFormRef.value) return;

	await changePasswordFormRef.value.validate(async (valid) => {
		if (valid) {
			try {
				changePasswordLoading.value = true;
				await UserApi.changePassword(userStore.userInfo!.id, changePasswordForm.value);
				ElMessage.success("密码修改成功");
				changePasswordVisible.value = false;
				changePasswordForm.value = {
					oldPassword: "",
					newPassword: "",
				};
			} catch (error) {
				console.error("修改密码失败:", error);
			} finally {
				changePasswordLoading.value = false;
			}
		}
	});
};

const handleProfile = () => {
	router.push(`/users/${userStore.userInfo?.id}`);
};

const handleLogout = () => {
	ElMessageBox.confirm("确定要退出吗？", "退出提示", {
		confirmButtonText: "退出",
		cancelButtonText: "点错了！",
		type: "warning",
	})
		.then(() => {
			authStore.clearToken();
			userStore.clearUserInfo();
			router.push("/login");
			ElMessage.success("退出成功！");
		})
		.catch(() => {
			// 用户主动点击取消按钮时，不显示任何消息
		});
};

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
