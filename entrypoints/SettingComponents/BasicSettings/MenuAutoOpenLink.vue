<template>
	<div class="item">
		<div class="tit">{{ sort }}. 是否自动打开外链（请谨慎操作，避免打开恶意链接）</div>
		<input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
	</div>
</template>

<script>
import $ from 'jquery';
export default {
	props: ['modelValue', 'sort'],
	emits: ['update:modelValue'],
	data() {
		return {
			observer: null,
		};
	},
	watch: {
		modelValue(newVal) {
			if (newVal) {
				this.startObserver();
			} else {
				this.stopObserver();
			}
		},
	},
	methods: {
		checkModal() {
			const el = document.getElementById('discourse-modal-title');
			if (el && el.textContent.trim() === '打开外部链接') {
				console.log('检测到外部链接弹窗');
				$('.modal-container .d-modal__footer .btn.btn-primary').click();
			}
		},
		startObserver() {
			if (this.observer) return;
			const target = document.body || document.documentElement;
			if (!target) return;
			this.checkModal();
			this.observer = new MutationObserver(() => {
				this.checkModal();
			});
			this.observer.observe(target, { childList: true, subtree: true });
		},
		stopObserver() {
			if (this.observer) {
				this.observer.disconnect();
				this.observer = null;
			}
		},
	},
	created() {
		if (this.modelValue) {
			this.startObserver();
		}
	},
	beforeDestroy() {
		this.stopObserver();
	},
};
</script>
