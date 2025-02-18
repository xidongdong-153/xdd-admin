<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage, ElCollapseTransition } from "element-plus";
import { InfoFilled, ArrowDown } from "@element-plus/icons-vue";
import type { PromptTemplate } from "./types";
import { templates as defaultTemplates } from "./config/templates.config";

const templates = ref<PromptTemplate[]>(defaultTemplates);
const activeTemplate = ref<PromptTemplate | null>(null);
const editedContent = ref("");
const activeNames = ref<number[]>([]);
const isGuideVisible = ref(false);

// 计算当前编辑内容的字数
const wordCount = computed(() => {
	return editedContent.value.length;
});

const handleCopy = async (content: string) => {
	try {
		await navigator.clipboard.writeText(content);
		ElMessage.success("复制成功");
	} catch {
		ElMessage.error("复制失败");
	}
};

const handleEdit = (template: PromptTemplate) => {
	activeTemplate.value = template;
	editedContent.value = template.content;
};

const handleSave = () => {
	if (!activeTemplate.value) return;

	const index = templates.value.findIndex(
		(template: PromptTemplate) => template.id === activeTemplate.value?.id,
	);
	if (index > -1) {
		templates.value[index].content = editedContent.value;
		ElMessage.success("保存成功");
		activeTemplate.value = null;
	}
};

const toggleGuide = () => {
	isGuideVisible.value = !isGuideVisible.value;
};
</script>

<template>
	<div class="flex h-full w-full flex-col dark:bg-gray-800">
		<h1 class="p-6 pb-0 text-2xl font-bold text-gray-900 dark:text-white">AI提问模板</h1>

		<!-- 使用指南 -->
		<div class="px-6 pt-4">
			<el-card
				class="guide-card !border-blue-100 !bg-blue-50 dark:!border-blue-800 dark:!bg-blue-950"
			>
				<div class="flex cursor-pointer items-center justify-between" @click="toggleGuide">
					<div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
						<el-icon><InfoFilled /></el-icon>
						<span class="text-lg font-medium">使用指南</span>
					</div>
					<el-icon
						class="transform text-blue-600 transition-transform duration-300 dark:text-blue-400"
						:class="{ 'rotate-180': isGuideVisible }"
					>
						<ArrowDown />
					</el-icon>
				</div>
				<el-collapse-transition>
					<div v-show="isGuideVisible" class="mt-4">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<!-- 左侧指南内容 -->
							<div class="space-y-4 text-sm text-blue-600 dark:text-blue-400">
								<div class="space-y-2">
									<h3 class="font-medium">如何选择合适的模板？</h3>
									<ul class="list-inside list-disc space-y-1">
										<li>功能需求模板：用于描述新功能、改进现有功能</li>
										<li>BUG修复模板：用于报告问题、描述错误现象</li>
										<li>代码优化模板：用于代码重构、性能优化</li>
										<li>架构设计模板：用于系统设计、技术方案</li>
										<li>代码审查模板：用于代码评审、质量检查</li>
										<li>API设计模板：用于接口设计、文档编写</li>
										<li>性能优化模板：用于性能问题分析和优化方案</li>
										<li>数据库设计模板：用于数据库表结构设计和优化</li>
										<li>测试用例模板：用于编写测试用例和测试计划</li>
										<li>部署配置模板：用于环境部署和配置说明</li>
										<li>学习提问模板：用于学习新技术和概念时提问</li>
										<li>方案咨询模板：用于技术方案建议和评估</li>
										<li>快速提问模板：用于日常开发中的简单问题</li>
									</ul>
								</div>
								<div class="space-y-2">
									<h3 class="font-medium">如何编写高质量的提问？</h3>
									<ul class="list-inside list-disc space-y-1">
										<li>清晰描述问题：准确表达你的需求或遇到的问题</li>
										<li>提供上下文：包含必要的背景信息和环境说明</li>
										<li>使用示例：通过代码示例或具体场景说明</li>
										<li>明确目标：说明期望达到的效果或解决方案</li>
										<li>补充尝试：说明已经尝试过的方案和结果</li>
										<li>相关资料：提供已查阅的文档或参考资料</li>
									</ul>
								</div>
								<div class="space-y-2">
									<h3 class="font-medium">操作提示</h3>
									<ul class="list-inside list-disc space-y-1">
										<li>点击模板标题可展开/折叠内容</li>
										<li>点击"编辑"按钮可修改模板内容</li>
										<li>点击"复制"按钮可复制文本到剪贴板</li>
										<li>编辑时可实时查看字数统计</li>
									</ul>
								</div>
							</div>

							<!-- 右侧示例 -->
							<div
								class="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-gray-900"
							>
								<h3 class="mb-3 text-base font-medium text-blue-600 dark:text-blue-400">
									使用示例：快速提问模板
								</h3>
								<pre class="whitespace-pre-wrap text-sm text-blue-600 dark:text-blue-400">
# 问题描述
- 具体问题：Vue3 + TS 项目中如何正确定义 Props 类型
- 相关上下文：在开发一个通用组件，需要支持多种类型的输入

# 补充信息
- 已尝试：使用 PropType，但遇到了泛型类型推导问题
- 期望答案：正确的类型定义方式和最佳实践示例</pre
								>
							</div>
						</div>
					</div>
				</el-collapse-transition>
			</el-card>
		</div>

		<div class="flex-1 overflow-hidden p-6">
			<div class="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
				<!-- 模板列表 -->
				<div class="h-full overflow-auto">
					<el-collapse v-model="activeNames">
						<el-collapse-item
							v-for="template in templates"
							:key="template.id"
							:name="template.id"
							class="rounded-lg border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900"
						>
							<template #title>
								<div class="flex w-full items-center justify-between pr-4">
									<span class="text-lg font-semibold text-gray-800 dark:text-white">
										{{ template.title }}
									</span>
									<div class="space-x-2">
										<el-button
											type="primary"
											link
											@click.stop="handleEdit(template)"
											class="!text-primary-500"
										>
											编辑
										</el-button>
										<el-button
											type="success"
											link
											@click.stop="handleCopy(template.content)"
											class="!text-success-500"
										>
											复制
										</el-button>
									</div>
								</div>
							</template>
							<pre
								class="max-h-60 overflow-auto rounded bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
								>{{ template.content }}</pre
							>
						</el-collapse-item>
					</el-collapse>
				</div>

				<!-- 编辑区域 -->
				<div
					v-if="activeTemplate"
					class="h-full overflow-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900"
				>
					<div class="mb-3 flex items-center justify-between">
						<h3 class="text-lg font-semibold text-gray-800 dark:text-white">编辑模板</h3>
						<div class="flex items-center space-x-2">
							<span class="text-sm text-gray-500 dark:text-gray-400">{{ wordCount }} 字</span>
							<el-button type="primary" @click="handleCopy(editedContent)">复制</el-button>
							<el-button type="success" @click="handleSave">保存</el-button>
						</div>
					</div>
					<el-input
						v-model="editedContent"
						type="textarea"
						:rows="20"
						class="h-[calc(100%-3rem)] w-full dark:bg-gray-800"
						:input-style="{
							color: 'var(--el-text-color-primary)',
							backgroundColor: 'var(--el-bg-color)',
							height: '100%',
						}"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.guide-card {
	:deep(.el-card__header) {
		@apply border-none bg-transparent p-4;
	}

	:deep(.el-card__body) {
		@apply p-4;
	}
}

:deep(.el-collapse-item__header) {
	@apply border-none bg-transparent p-4;
}

:deep(.el-collapse-item__wrap) {
	@apply border-none bg-transparent;
}

:deep(.el-collapse-item__content) {
	@apply p-0;
}

:deep(.el-button--primary.is-link) {
	--el-button-hover-text-color: var(--el-color-primary-light-3);
}

:deep(.el-button--success.is-link) {
	--el-button-hover-text-color: var(--el-color-success-light-3);
}

:deep(.el-collapse-transition) {
	@apply overflow-hidden transition-all duration-300;
}
</style>
