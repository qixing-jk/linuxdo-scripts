<template>
	<div class="item">
		<div class="tit">切换下拉菜单模式显示自定义快捷回复</div>
		<input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
	</div>
</template>

<script>
export default {
	props: ['modelValue', 'sort'],
	emits: ['update:modelValue'],
};
</script>
