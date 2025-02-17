import type { UserInfo } from "@/api/modules/user/types";
import { UserApi } from "@/api/modules/user/user-api";
import { useRequest } from "@/hooks/useRequest";
import { defineStore } from "pinia";
import { ref } from "vue";

export const USER_INFO_KEY = "userInfo";

export const useUserStore = defineStore("user", () => {
	const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem(USER_INFO_KEY) || "null"));

	const getUserInfo = () => {
		const { run } = useRequest(UserApi.getCurrentUser, undefined, {
			onSuccess: (data) => {
				userInfo.value = data || null;

				localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo.value));
			},
		});
		run();
	};

	const clearUserInfo = () => {
		userInfo.value = null;
		localStorage.removeItem(USER_INFO_KEY);
	};

	return {
		userInfo,
		getUserInfo,
		clearUserInfo,
	};
});
