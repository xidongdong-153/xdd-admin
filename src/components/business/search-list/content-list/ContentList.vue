<template>
	<div class="flex h-full flex-1 flex-col">
		<!-- 工具栏 -->
		<div v-if="showToolbar" class="mb-4 flex items-center justify-end gap-2">
			<el-button
				v-if="config.toolbar?.showAdd"
				type="primary"
				:icon="Plus"
				size="small"
				@click="emit('add')"
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
					v-if="config.actions?.length"
					fixed="right"
					label="操作"
					:width="actionWidth"
					align="center"
				>
					<template #default="{ row }">
						<el-space :size="4">
							<el-button
								v-for="action in config.actions"
								:key="action.label"
								:type="action.type || 'primary'"
								link
								@click="action.onClick(row)"
							>
								{{ action.label }}
							</el-button>
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
	</div>
</template>

<script setup lang="ts" generic="T, Q extends PaginationQuery">
import { computed, ref, watch } from "vue";
import type { ContentListConfig } from "../types";
import type { PaginatedData, PaginationQuery } from "@/api/core/types";
import { useRequest } from "@/hooks/useRequest";
import { Plus, Refresh, Setting, ArrowDown } from "@element-plus/icons-vue";

const props = defineProps<{
	config: ContentListConfig<T, Q>;
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
	return (props.config.actions?.length || 0) * 60 + 20;
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
