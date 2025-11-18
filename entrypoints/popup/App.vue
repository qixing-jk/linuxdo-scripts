<template>
	<DialogComponents />
</template>

<script>
import DialogComponents from '../DialogComponents/index.vue';
export default {
	name: 'App',
	components: {
		DialogComponents,
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
