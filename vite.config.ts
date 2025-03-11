import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
	plugins: [vue(), vueJsx(), vueDevTools()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			assets: fileURLToPath(new URL("./src/assets", import.meta.url)),
			components: fileURLToPath(new URL("./src/components", import.meta.url)),
			config: fileURLToPath(new URL("./src/config", import.meta.url)),
			views: fileURLToPath(new URL("./src/views", import.meta.url)),
			utils: fileURLToPath(new URL("./src/utils", import.meta.url)),
			api: fileURLToPath(new URL("./src/api", import.meta.url)),
			stores: fileURLToPath(new URL("./src/stores", import.meta.url)),
			types: fileURLToPath(new URL("./src/types", import.meta.url)),
			layouts: fileURLToPath(new URL("./src/layouts", import.meta.url)),
		},
	},
	server: {
		host: "0.0.0.0",
		port: 9999,
		open: false,
		proxy: {
			// XDD API
			"/api": {
				target: "http://localhost:3100", // xdd api 服务地址
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/api/, '') // 如果后端接口没有 /api 前缀，需要去掉
			},
		},
	},
});
