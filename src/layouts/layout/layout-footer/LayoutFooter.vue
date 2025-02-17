<template>
	<footer
		class="flex h-12 items-center justify-center bg-white px-4 !transition-colors !duration-300 dark:bg-gray-900"
	>
		<div class="text-sm text-gray-500 dark:text-white">
			© {{ new Date().getFullYear() }} 垃圾博客后台管理系统 v{{ version }}
		</div>
	</footer>
</template>

<script setup lang="ts">
const version = import.meta.env.VITE_APP_VERSION;
</script>
