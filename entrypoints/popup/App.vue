<template>
	<PopupViews />
</template>

<script>
import PopupViews from '../PopupViews/index.vue';
export default {
	name: 'App',
	components: {
		PopupViews,
	},
};
</script>

<style>
body {
	width: 450px;
	overflow: hidden;
}
.container {
	height: 500px;
	overflow-y: scroll;
}
</style>
