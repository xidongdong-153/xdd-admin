<template>
	<el-drawer
		v-model="visible"
		:title="title"
		:size="width"
		:destroy-on-close="true"
		@close="handleClose"
	>
		<el-form
			ref="formRef"
			:model="formData"
			:rules="formConfig.rules"
			label-width="100px"
			class="p-4"
		>
			<el-row :gutter="16">
				<el-col v-for="item in formConfig.fields" :key="String(item.field)" :span="item.span || 24">
					<el-form-item :label="item.label" :prop="String(item.field)">
						<!-- 输入框 -->
						<el-input
							v-if="item.type === FormItemType.INPUT"
							v-model="formData[item.field]"
							:placeholder="item.placeholder"
						>
						</el-input>

						<!-- 选择框 -->
						<el-select
							v-else-if="item.type === FormItemType.SELECT"
							v-model="formData[item.field]"
							:placeholder="item.placeholder"
							class="w-full"
						>
							<el-option
								v-for="option in item.options"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>

						<!-- 日期选择器 -->
						<el-date-picker
							v-else-if="item.type === FormItemType.DATE_PICKER"
							v-model="formData[item.field]"
							:placeholder="item.placeholder"
							class="w-full"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<template #footer>
			<div class="flex justify-end gap-2">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" :loading="loading" @click="handleSubmit"> 确定 </el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, watch, reactive, toRaw } from "vue";
import type { FormInstance } from "element-plus";
import type { FormConfig } from "../types";
import { FormItemType } from "../types";

const props = defineProps<{
	modelValue: boolean;
	title: string;
	width?: string | number;
	formConfig: FormConfig<T>;
	initialData?: Partial<T>;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "submit", data: T): void;
}>();

const visible = ref(props.modelValue);
const loading = ref(false);
const formRef = ref<FormInstance>();

// 初始化表单数据
const initFormData = (): T => {
	if (props.initialData) {
		return { ...props.initialData } as T;
	}

	// 根据formConfig.fields创建空对象
	const emptyData: Partial<T> = {};
	props.formConfig.fields.forEach((field) => {
		const fieldName = String(field.field);
		(emptyData[fieldName as keyof T] as T[keyof T] | undefined) = undefined;
	});
	return emptyData as T;
};

const formData = reactive<T>(initFormData());

// 监听visible变化
watch(
	() => props.modelValue,
	(val: boolean) => {
		visible.value = val;
	},
);

// 监听内部visible变化
watch(visible, (val: boolean) => {
	emit("update:modelValue", val);
});

// 关闭抽屉
const handleClose = () => {
	visible.value = false;
	formRef.value?.resetFields();
};

// 提交表单
const handleSubmit = async () => {
	if (!formRef.value) return;

	try {
		loading.value = true;
		await formRef.value.validate();
		// 使用类型断言确保类型安全
		const rawData = toRaw(formData) as T;
		emit("submit", rawData);
		handleClose();
	} catch (error) {
		// 表单验证失败
		console.error("表单验证失败:", error);
	} finally {
		loading.value = false;
	}
};

// 重置表单
const resetForm = () => {
	formRef.value?.resetFields();
};

defineExpose({
	resetForm,
});
</script>
