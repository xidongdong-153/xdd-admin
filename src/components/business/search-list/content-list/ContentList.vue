<template>
	<div class="flex h-full flex-1 flex-col">
		<!-- 工具栏 -->
		<div v-if="showToolbar" class="mb-4 flex items-center justify-end gap-2">
			<el-button
				v-if="config.toolbar?.showAdd"
				type="primary"
				:icon="Plus"
				size="small"
				@click="handleAdd"
			>
				新增
			</el-button>

			<el-button
				v-if="config.toolbar?.showRefresh"
				:icon="Refresh"
				size="small"
				@click="handleRefresh"
			>
				刷新
			</el-button>

			<el-dropdown
				v-if="config.toolbar?.showColumnSetting"
				trigger="click"
				@command="handleColumnCommand"
			>
				<el-button size="small">
					<el-icon>
						<Setting />
					</el-icon>
					<span class="ml-1">列设置</span>
					<el-icon class="el-icon--right">
						<ArrowDown />
					</el-icon>
				</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item
							v-for="column in columns"
							:key="String(column.prop)"
							:command="String(column.prop)"
						>
							<el-checkbox v-model="column.visible" @click.stop class="w-full">
								{{ column.label }}
							</el-checkbox>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

		<!-- 表格区域 -->
		<div class="min-h-0 flex-1">
			<el-table
				:data="data?.items || []"
				:border="true"
				:stripe="true"
				:loading="loading"
				height="100%"
				class="w-full"
			>
				<el-table-column
					v-for="col in visibleColumns"
					:key="String(col.prop)"
					:prop="col.prop as string"
					:label="col.label"
					:width="col.width"
					:fixed="col.fixed"
					show-overflow-tooltip
				>
					<template v-if="col.render" #default="{ row }">
						<component :is="col.render(row)" />
					</template>
				</el-table-column>

				<!-- 操作列 -->
				<el-table-column
					v-if="config.showActions !== false"
					fixed="right"
					label="操作"
					:width="actionWidth"
					align="center"
				>
					<template #default="{ row }">
						<el-space :size="4">
							<el-button v-if="config.api.update" type="primary" link @click="handleEdit(row)">
								编辑
							</el-button>
							<el-button v-if="config.api.delete" type="danger" link @click="handleDelete(row)">
								删除
							</el-button>
							<template v-if="config.actions?.length">
								<el-button
									v-for="action in config.actions"
									:key="action.label"
									:type="action.type || 'primary'"
									link
									@click="action.onClick(row)"
								>
									{{ action.label }}
								</el-button>
							</template>
						</el-space>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 分页器 -->
		<div class="flex shrink-0 justify-end py-4">
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[10, 20, 30, 50]"
				:total="data?.meta.totalItems || 0"
				:background="true"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>

		<!-- 表单抽屉 -->
		<form-drawer
			v-if="currentFormConfig"
			v-model="showFormDrawer"
			:title="drawerTitle"
			:form-config="currentFormConfig"
			:initial-data="currentFormData"
			@submit="handleFormSubmit"
		/>
	</div>
</template>

<script
	setup
	lang="ts"
	generic="
		T extends { id: number } & Record<string, any>,
		Q extends PaginationQuery,
		C extends { id?: number } & Record<string, any> = T
	"
>
import { computed, ref, watch } from "vue";
import type { ContentListConfig } from "../types";
import type { PaginatedData, PaginationQuery } from "@/api/core/types";
import { useRequest } from "@/hooks/useRequest";
import { Plus, Refresh, Setting, ArrowDown } from "@element-plus/icons-vue";
import FormDrawer from "../form-drawer/FormDrawer.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormItemRule } from "element-plus";
import type { FormConfig, FormItemConfig } from "../types";

const props = defineProps<{
	config: ContentListConfig<T, Q, C>;
}>();

const emit = defineEmits<{
	(e: "add"): void;
	(e: "update:queryParams", params: Q): void;
}>();

// 计算是否显示工具栏
const showToolbar = computed<boolean>(() => {
	const { toolbar } = props.config;
	return Boolean(toolbar?.showAdd || toolbar?.showRefresh || toolbar?.showColumnSetting);
});

// 计算操作列宽度
const actionWidth = computed(() => {
	const baseWidth = 150; // 基础宽度
	const customActionsWidth = (props.config.actions?.length || 0) * 60;
	return baseWidth + customActionsWidth;
});

// 计算可见列
const visibleColumns = computed(() => {
	return columns.value.filter((col) => col.visible !== false);
});

// 列配置
const columns = ref(
	props.config.columns.map((col) => ({
		...col,
		visible: col.visible ?? true,
	})),
);

// 分页相关
const currentPage = ref(props.config.queryParams.page);
const pageSize = ref(props.config.queryParams.limit);

// 查询参数
const queryParams = ref<Q>(props.config.queryParams);

// 使用 useRequest 处理请求
const {
	data,
	loading,
	run: fetchData,
} = useRequest<PaginatedData<T>>(() => props.config.api.getList(queryParams.value), undefined, {
	immediate: false,
});

// 监听分页参数变化
watch([currentPage, pageSize], ([newPage, newSize]) => {
	queryParams.value = {
		...queryParams.value,
		page: newPage,
		limit: newSize,
	};
	fetchData();
	emit("update:queryParams", queryParams.value);
});

// 搜索方法
const search = (params: Partial<Q>) => {
	queryParams.value = {
		...queryParams.value,
		...params,
		page: 1,
	};
	currentPage.value = 1;
	fetchData();
};

// 重置方法
const reset = () => {
	queryParams.value = {
		...props.config.queryParams,
		page: 1,
	};
	currentPage.value = 1;
	fetchData();
};

// 列设置
const handleColumnCommand = (prop: string) => {
	console.log("测试");
	const column = columns.value.find((col) => String(col.prop) === prop);
	if (column) {
		column.visible = !column.visible;
	}
};

// 分页处理
const handleCurrentChange = (page: number) => {
	currentPage.value = page;
};

const handleSizeChange = (size: number) => {
	pageSize.value = size;
	currentPage.value = 1;
};

// 刷新数据
const handleRefresh = () => {
	fetchData();
};

// 表单抽屉相关
const showFormDrawer = ref(false);
const drawerTitle = ref("");
const currentFormData = ref<Partial<C>>();
const currentFormConfig = ref<typeof props.config.formConfig>();

// 处理表单配置
const handleFormConfig = (isEdit: boolean) => {
	if (!props.config.formConfig) return;

	// 深拷贝表单配置
	const formConfig = JSON.parse(JSON.stringify(props.config.formConfig)) as FormConfig<C>;

	// 编辑模式下移除必填校验
	if (isEdit) {
		// 处理字段级别的规则
		formConfig.fields.forEach((field: FormItemConfig<C>) => {
			if (field.rules) {
				field.rules = field.rules.filter((rule: FormItemRule) => !rule.required);
			}
		});

		// 处理表单级别的规则
		if (formConfig.rules) {
			const rules = { ...formConfig.rules };
			Object.keys(rules).forEach((key) => {
				const fieldRules = rules[key as keyof C];
				if (Array.isArray(fieldRules)) {
					rules[key as keyof C] = fieldRules.filter((rule: FormItemRule) => !rule.required);
				}
			});
			formConfig.rules = rules;
		}
	}

	currentFormConfig.value = formConfig;
};

// 内置编辑方法
const handleEdit = (row: T) => {
	drawerTitle.value = "编辑";
	// 只保留表单配置中定义的字段
	const formFields = props.config.formConfig?.fields.map((field) => field.field) || [];
	const filteredData = Object.fromEntries(
		Object.entries(row).filter(([key]) => formFields.includes(key as keyof C)),
	);
	currentFormData.value = filteredData as C;
	handleFormConfig(true);
	showFormDrawer.value = true;
};

// 内置删除方法
const handleDelete = async (row: T) => {
	if (!props.config.api.delete) {
		ElMessage.warning("未配置删除接口");
		return;
	}

	try {
		await ElMessageBox.confirm("确认删除该记录吗？", "提示", {
			type: "warning",
		});

		await props.config.api.delete(row.id);
		ElMessage.success("删除成功");
		fetchData();
	} catch {
		// 用户取消删除或删除失败，不做处理
	}
};

// 内置新增方法
const handleAdd = () => {
	if (!props.config.api.create) {
		ElMessage.warning("未配置新增接口");
		return;
	}
	drawerTitle.value = "新增";
	currentFormData.value = {};
	handleFormConfig(false);
	showFormDrawer.value = true;
};

// 表单提交处理
const handleFormSubmit = async (formData: C) => {
	try {
		if (currentFormData.value?.id) {
			// 编辑模式
			if (!props.config.api.update) {
				ElMessage.warning("未配置更新接口");
				return;
			}
			await props.config.api.update(currentFormData.value.id, formData as unknown as Partial<T>);
			ElMessage.success("更新成功");
		} else {
			// 新增模式
			if (!props.config.api.create) {
				ElMessage.warning("未配置新增接口");
				return;
			}
			await props.config.api.create(formData);
			ElMessage.success("新增成功");
		}
		showFormDrawer.value = false;
		fetchData();
	} catch {
		ElMessage.error("操作失败");
	}
};

// 初始化加载数据
fetchData();

// 暴露方法
defineExpose({
	search,
	refresh: handleRefresh,
	reset,
});
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item) {
	@apply p-2;

	.el-checkbox {
		width: 100%;

		&__label {
			@apply overflow-hidden text-ellipsis whitespace-nowrap;
		}
	}
}

:deep(.el-table) {
	@apply h-full;

	.el-table__body-wrapper {
		@apply overflow-y-auto;
	}

	.el-table__row {
		&.el-table__row--striped {
			@apply bg-gray-50;
		}
	}
}
</style>
