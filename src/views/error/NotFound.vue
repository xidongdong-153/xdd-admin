<template>
	<div class="flex flex-col items-center justify-center">
		<el-result icon="warning" title="404" sub-title="抱歉，你访问的页面不存在！">
			<template #extra>
				<el-button type="primary" @click="router.push('/')"> 返回首页 </el-button>
			</template>
		</el-result>
	</div>
</template>

<script setup lang="ts">
import { ElResult, ElButton } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
