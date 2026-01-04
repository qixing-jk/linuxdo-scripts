<template>
	<div class="fixed">
		<!-- 文件夹 -->
		<div
			class="item"
			@click="toggleMenu('folder')"
			:class="{ active: menutype == 'folder' }"
			title="文件夹"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-folder-closed-icon lucide-folder-closed"
			>
				<path
					d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
				/>
				<path d="M2 10h20" />
			</svg>
			<span>收藏夹</span>
		</div>
		<!-- 分类 -->
		<div
			class="item"
			@click="toggleMenu('cate')"
			:class="{ active: menutype == 'cate' }"
			title="话题分类"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-chart-column-stacked-icon lucide-chart-column-stacked"
			>
				<path d="M11 13H7" />
				<path d="M19 9h-4" />
				<path d="M3 3v16a2 2 0 0 0 2 2h16" />
				<rect
					x="15"
					y="5"
					width="4"
					height="12"
					rx="1"
				/>
				<rect
					x="7"
					y="8"
					width="4"
					height="9"
					rx="1"
				/>
			</svg>
			<span>话题分类</span>
		</div>
		<!-- 标签 -->
		<div
			class="item"
			@click="toggleMenu('tags')"
			:class="{ active: menutype == 'tags' }"
			title="标签"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-tags-icon lucide-tags"
			>
				<path
					d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z"
				/>
				<path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193" />
				<circle
					cx="10.5"
					cy="6.5"
					r=".5"
					fill="currentColor"
				/>
			</svg>
			<span>话题标签</span>
		</div>
		<!-- 手动新增 -->
		<div
			class="item"
			@click="openAddPostDialog"
			title="添加书签"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-bookmark-plus-icon lucide-bookmark-plus"
			>
				<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
				<line
					x1="12"
					x2="12"
					y1="7"
					y2="13"
				/>
				<line
					x1="15"
					x2="9"
					y1="10"
					y2="10"
				/>
			</svg>
			<span>添加书签</span>
		</div>
		<!-- Webdav 同步 -->
		<div
			class="item"
			@click="openWebdavDialog"
			title="WebDAV 同步"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-settings-icon lucide-settings"
			>
				<path
					d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
				/>
				<circle
					cx="12"
					cy="12"
					r="3"
				/>
			</svg>
			<span>WebDAV 同步</span>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	menutype: {
		type: String,
		default: 'folder'
	}
})

const emit = defineEmits(['toggleMenu', 'openAddPostDialog', 'openWebdavDialog'])

const toggleMenu = (type) => {
	emit('toggleMenu', type)
}

const openAddPostDialog = () => {
	emit('openAddPostDialog')
}

const openWebdavDialog = () => {
	emit('openWebdavDialog')
}
</script>
