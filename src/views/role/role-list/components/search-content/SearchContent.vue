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
			<ContentList :config="listConfig" @add="handleAdd" ref="contentListRef" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { RoleInfo, RoleListRequest } from "@/api/modules/role/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { RoleApi } from "@/api/modules/role/role-api";
import type { ContentListConfig } from "@/components/business/search-list/types";
import { ContentList, SearchCondition } from "@/components/business/search-list";
import type { ComponentPublicInstance } from "vue";
import type { SearchForm } from "./types";
import {
	getFormConfig,
	generateRules,
	getListConfig,
} from "@/views/role/role-list/components/search-content/config";

type RoleContentList = ComponentPublicInstance & {
	search: (params: Partial<RoleListRequest>) => void;
	refresh: () => void;
	reset: () => void;
};

// ContentList 组件引用
const contentListRef = ref<RoleContentList>();

// 搜索表单数据
const searchForm = ref<SearchForm>({
	name: "",
	description: "",
});

// 表单配置
const formConfig = computed(() => getFormConfig());

// 表单验证规则
const rules = computed(() => generateRules(formConfig.value));

/**
 * 过滤空值参数
 */
const filterEmptyParams = (params: SearchForm): Partial<RoleListRequest> => {
	return Object.fromEntries(
		Object.entries(params).filter(([, value]) => value !== ""),
	) as Partial<RoleListRequest>;
};

// 搜索处理
const handleSearch = () => {
	contentListRef.value?.search(filterEmptyParams(searchForm.value));
};

// 重置处理
const handleReset = () => {
	// 1. 重置响应式表单数据
	searchForm.value = {
		name: "",
		description: "",
	};

	// 2. 重置搜索参数并刷新数据
	contentListRef.value?.reset();
};

// 列表配置
const listConfig = computed<ContentListConfig<RoleInfo, RoleListRequest>>(() =>
	getListConfig(handleEdit, handleDelete),
);

// 处理方法
const handleAdd = () => {
	// TODO: 实现新增角色
	console.log("新增角色");
};

const handleEdit = (row: RoleInfo) => {
	// TODO: 实现编辑角色
	console.log("编辑角色", row);
};

const handleDelete = async (row: RoleInfo) => {
	try {
		await ElMessageBox.confirm("确认删除该角色?", "提示", {
			type: "warning",
			confirmButtonText: "确定",
			cancelButtonText: "取消",
		});
		await RoleApi.delete(row.id);
		ElMessage.success("删除成功");
		contentListRef.value?.refresh();
	} catch {
		// 错误已经被统一处理
	}
};
</script>
