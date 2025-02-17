import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Element Plus
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";

// API 相关
import { ApiService } from "@/api/core/request";
import { useAuthStore } from "@/stores/modules/auth";

// 样式导入
import "assets/styles/index.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";

// 异步启动函数
async function bootstrap() {
	try {
		const app = createApp(App);
		const pinia = createPinia();

		// 注册 Element Plus
		app.use(ElementPlus, {
			locale: zhCn,
		});

		// 注册所有图标
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			app.component(key, component);
		}

		app.use(pinia);

		// 初始化 token
		const authStore = useAuthStore();
		if (authStore.token) {
			const apiClient = ApiService.getInstance("xdd-api", {
				baseURL: import.meta.env.VITE_API_BASE_URL,
				timeout: 10000,
			});
			apiClient.setAuthToken(authStore.token);
		}

		app.use(router);
		app.mount("#app");
	} catch (error) {
		console.error("💩 启动失败！", error);
	}
}

// 启动应用
bootstrap();
