<template>
	<div class="mb-4 rounded-lg border border-gray-300 shadow-sm dark:border-gray-500">
		<!-- 头部区域 -->
		<div class="flex cursor-pointer items-center gap-2 px-4 py-3" @click="toggleExpand">
			<div
				class="flex h-5 w-5 items-center justify-center transition-transform duration-300"
				:class="{ 'rotate-90': isExpanded }"
			>
				<el-icon :size="16"><ArrowRightBold /></el-icon>
			</div>
			<div class="text-base font-medium text-gray-900 dark:text-white">搜索</div>
		</div>

		<!-- 内容区域 -->
		<el-collapse-transition>
			<div v-show="isExpanded">
				<div class="border-t border-gray-200 px-4 py-4 dark:border-gray-700">
					<el-form
						ref="formRef"
						:model="formModel"
						:rules="rules"
						label-position="top"
						@keyup.enter="handleSearch"
					>
						<el-row :gutter="16">
							<el-col
								v-for="item in formConfig"
								:key="item.field"
								:xs="24"
								:sm="12"
								:md="12"
								:lg="item.span || 8"
								:xl="item.span || 8"
							>
								<el-form-item :label="item.label" :prop="item.field">
									<!-- 输入框 -->
									<el-input
										v-if="item.type === FormItemType.INPUT"
										v-model="formModel[item.field] as InputValue"
										:placeholder="item.placeholder"
										:prefix-icon="item.icon"
										clearable
									/>

									<!-- 选择框 -->
									<el-select
										v-else-if="item.type === FormItemType.SELECT"
										v-model="formModel[item.field] as SelectValue"
										:placeholder="item.placeholder"
										clearable
										class="w-full"
									>
										<el-option
											v-for="option in item.options"
											:key="option.value"
											:value="option.value"
											:label="option.label"
										/>
									</el-select>

									<!-- 日期选择器 -->
									<el-date-picker
										v-else-if="item.type === FormItemType.DATE_PICKER"
										v-model="formModel[item.field] as DateValue"
										:placeholder="item.placeholder"
										class="w-full"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<!-- 操作按钮 -->
						<el-row>
							<el-col :span="24">
								<div class="mt-4 flex justify-end gap-2">
									<el-button :icon="Refresh" @click="handleReset">重置</el-button>
									<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
								</div>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>
		</el-collapse-transition>
	</div>
</template>

<script setup lang="ts">
import type { SearchForm, FormItemConfig, InputValue, SelectValue, DateValue } from "../types";
import { FormItemType } from "../types";
import { ArrowRightBold, Search, Refresh } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { ref, computed } from "vue";

// 定义属性
const props = defineProps<{
	modelValue: SearchForm;
	formConfig: FormItemConfig<SearchForm>[];
	rules: FormRules;
}>();

// 定义事件
const emit = defineEmits<{
	"update:modelValue": [value: SearchForm];
	search: [form: SearchForm];
	reset: [form: SearchForm];
}>();

// 表单ref
const formRef = ref<FormInstance>();

// 展开状态
const isExpanded = ref(false);

// 表单数据（计算属性）
const formModel = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

// 切换展开/收起
const toggleExpand = () => {
	isExpanded.value = !isExpanded.value;
};

// 重置表单
const handleReset = () => {
	if (!formRef.value) return;
	formRef.value.resetFields();
	emit("reset", { ...props.modelValue });
};

// 搜索处理
const handleSearch = async () => {
	if (!formRef.value) return;

	await formRef.value.validate((valid) => {
		if (valid) {
			emit("search", { ...props.modelValue });
		}
	});
};
</script>

<style scoped lang="scss">
:deep(.el-form-item__label) {
	@apply text-sm text-gray-600 dark:text-white;
}
</style>
