interface AppConfig {
	appName: string;
	apiBaseURL: string;
	timeout: number;
}

const config: AppConfig = {
	appName: import.meta.env.VITE_APP_NAME || "后台管理系统",
	apiBaseURL: import.meta.env.VITE_API_URL || "http://localhost:9999",
	timeout: 10000,
};

export default config;

console.log("当前系统配置：", config);
