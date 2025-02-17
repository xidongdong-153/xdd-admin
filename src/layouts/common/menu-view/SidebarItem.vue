<template>
	<template v-if="menu.children?.length">
		<el-sub-menu :index="menu.path">
			<template #title>
				<el-icon
					><component :is="menu.meta?.icon ? Icons[menu.meta.icon as keyof typeof Icons] : Icons.Location"
				/></el-icon>
				<span>{{ menu.meta?.title }}</span>
			</template>
			<SidebarItem
				v-for="child in menu.children"
				:key="child.id"
				:menu="child"
				@menu-click="$emit('menu-click', child)"
			/>
			<!-- 递归调用 -->
		</el-sub-menu>
	</template>
	<template v-else>
		<el-menu-item :index="menu.path" @click="$emit('menu-click', menu)">
			<el-icon
				><component :is="menu.meta?.icon ? Icons[menu.meta.icon as keyof typeof Icons] : Icons.QuestionFilled"
			/></el-icon>
			<span>{{ menu.meta?.title }}</span>
		</el-menu-item>
	</template>
</template>

<script setup lang="ts">
import { type MenuItem } from "@/layouts/types";
import * as Icons from "@element-plus/icons-vue";
import { ElIcon, ElSubMenu, ElMenuItem } from "element-plus";

defineProps<{
	menu: MenuItem;
}>();

defineEmits<{
	(e: "menu-click", menu: MenuItem): void;
}>();
</script>
