/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** 环境变量 */
	VITE_APP_MODE: string;
	/** 应用版本 */
	VITE_APP_VERSION: string;
	/** 基础路径 */
	VITE_BASE_URL: string;
}
