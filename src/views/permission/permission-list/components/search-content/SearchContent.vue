<template>
	<div class="flex h-full w-full flex-col overflow-hidden">
		<div class="shrink-0">
			<SearchCondition
				v-model="searchForm"
				:form-config="formConfig"
				:rules="rules"
				@search="handleSearch"
				@reset="handleReset"
			/>
		</div>

		<div class="min-h-0 flex-1">
			<ContentList :config="listConfig" ref="contentListRef" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type {
	PermissionInfo,
	PermissionListRequest,
	CreatePermission,
} from "@/api/modules/permission/types";
import type { ContentListConfig } from "@/components/business/search-list/types";
import { ContentList, SearchCondition } from "@/components/business/search-list";
import type { ComponentPublicInstance } from "vue";
import type { SearchForm } from "./types";
import { getFormConfig, generateRules, getListConfig } from "./config";

type PermissionContentList = ComponentPublicInstance & {
	search: (params: Partial<PermissionListRequest>) => void;
	refresh: () => void;
	reset: () => void;
};

// ContentList 组件引用
const contentListRef = ref<PermissionContentList>();

// 搜索表单数据
const searchForm = ref<SearchForm>({
	code: "",
	module: "",
});

// 表单配置
const formConfig = computed(() => getFormConfig());

// 表单验证规则
const rules = computed(() => generateRules(formConfig.value));

/**
 * 过滤空值参数
 */
const filterEmptyParams = (params: SearchForm): Partial<PermissionListRequest> => {
	return Object.fromEntries(
		Object.entries(params).filter(([, value]) => value !== ""),
	) as Partial<PermissionListRequest>;
};

// 搜索处理
const handleSearch = () => {
	contentListRef.value?.search(filterEmptyParams(searchForm.value));
};

// 重置处理
const handleReset = () => {
	// 1. 重置响应式表单数据
	searchForm.value = {
		code: "",
		module: "",
	};

	// 2. 重置搜索参数并刷新数据
	contentListRef.value?.reset();
};

// 列表配置
const listConfig = computed<
	ContentListConfig<PermissionInfo, PermissionListRequest, CreatePermission>
>(() => getListConfig());
</script>
