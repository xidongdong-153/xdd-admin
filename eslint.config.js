import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
	{
		name: "app/files-to-lint",
		files: ["**/*.{ts,mts,tsx,vue}"],
	},

	{
		name: "app/files-to-ignore",
		ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
	},
	{
		rules: {
			"@typescript-eslint/no-empty-object-type": 0,
		},
	},
	...pluginVue.configs["flat/essential"],
	...vueTsEslintConfig(),
	skipFormatting,
];
