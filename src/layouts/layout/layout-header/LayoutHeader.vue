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
					<span class="text-gray-600 dark:text-white"> {{ userStore.userInfo?.username }} </span>
				</div>

				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="handleProfile">
							<el-icon><User /></el-icon>
							个人信息
						</el-dropdown-item>
						<el-dropdown-item @click="handleLogout">
							<el-icon><SwitchButton /></el-icon>
							退出登录
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
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
} from "element-plus";
import { Moon, Sunny, User, SwitchButton } from "@element-plus/icons-vue";
import { useDark, useToggle } from "@vueuse/core";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const handleLogout = () => {
	ElMessageBox.confirm("你他妈确定要退出吗？", "操！退出提示", {
		confirmButtonText: "老子要退出",
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

const handleProfile = () => {
	router.push("/profile");
	console.log("Navigate to profile page");
};

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
