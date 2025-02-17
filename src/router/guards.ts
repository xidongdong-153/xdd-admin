import type { Router } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";

// 白名单路由
const whiteList = ["/login", "/error/403", "/error/404"];

/**
 * 设置路由守卫
 */
export function setupGuards(router: Router) {
	router.beforeEach(async (to, from, next) => {
		const authStore = useAuthStore();
		const userStore = useUserStore();

		// 1. 如果是访问登录页
		if (to.path === "/login") {
			if (authStore.isAuthenticated()) {
				// 已登录，跳转到首页
				next("/");
				return;
			}
			// 未登录，允许访问登录页
			next();
			return;
		}

		// 2. 白名单直接放行（除了登录页，因为已经处理过了）
		if (whiteList.includes(to.path)) {
			next();
			return;
		}

		// 3. 检查路由是否需要认证
		if (to.meta.requiresAuth) {
			// 如果未认证，跳转到登录页
			if (!authStore.isAuthenticated()) {
				next({
					path: "/login",
					query: { redirect: to.fullPath },
				});
				return;
			}

			// 确保有用户信息
			if (!userStore.userInfo) {
				try {
					await userStore.getUserInfo();
				} catch (error: unknown) {
					// 获取用户信息失败，可能是 token 已失效
					console.error(error);
					next({
						path: "/login",
						query: {
							redirect: to.fullPath,
							message: "请重新登录",
						},
					});
					return;
				}
			}
		}

		// 4. 检查角色权限（如果有的话）
		const { roles } = to.meta;
		if (roles && roles.length > 0) {
			// TODO: 从用户信息中获取角色，这里暂时模拟
			const userRoles = ["admin"];
			const hasRole = roles.some((role) => userRoles.includes(role));
			if (!hasRole) {
				next("/error/403");
				return;
			}
		}

		// 5. 已认证且有权限，放行
		next();
	});
}
