import { defineStore } from "pinia";
import type { SettingState } from "./types";

export const useSettingStore = defineStore("setting", {
	state: (): SettingState => ({
		showTags: true,
		sidebarLogo: true,
	}),
	getters: {},
	actions: {},
});
