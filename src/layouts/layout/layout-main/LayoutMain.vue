<template>
	<main class="flex-1 overflow-auto bg-white p-4 !transition-colors !duration-300 dark:bg-gray-900">
		<router-view v-slot="{ Component }">
			<transition name="el-fade-in-linear" mode="out-in">
				<keep-alive :include="['DashboardView']">
					<component :is="Component" :key="$route.fullPath" />
				</keep-alive>
			</transition>
		</router-view>
	</main>
</template>

<script setup lang="ts"></script>
