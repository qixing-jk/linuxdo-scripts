<template>
	<div class="item">
		<div class="tit">
			<!-- 是否保留发帖人仅 PC 端 类主站样式有效，移动端默认只有发帖人 -->
			{{ sort }}. 是否移除话题列表上的头像
			<br />
			<span>
				是否保留发帖人头像
				<input
					type="checkbox"
					:checked="modelValue.showAuthor"
					@change="
						$emit('update:modelValue', {
							enable: modelValue.enable,
							showAuthor: $event.target.checked,
							showAuthorName: modelValue.showAuthorName,
						})
					"
				/>
			</span>

			<span v-if="modelValue.showAuthor">
				是否显示发帖人名称
				<input
					type="checkbox"
					:checked="modelValue.showAuthorName"
					@change="
						$emit('update:modelValue', {
							enable: modelValue.enable,
							showAuthor: modelValue.showAuthor,
							showAuthorName: $event.target.checked,
						})
					"
				/>
			</span>
		</div>
		<input
			type="checkbox"
			:checked="modelValue.enable"
			@change="
				$emit('update:modelValue', {
					enable: $event.target.checked,
					showAuthor: modelValue.showAuthor,
					showAuthorName: modelValue.showAuthorName,
				})
			"
		/>
	</div>
</template>

<script>
import $ from 'jquery';
export default {
	props: ['modelValue', 'sort'],
	emits: ['update:modelValue'],
	data() {
		return {
			updateIntervalId: null,
			pollingIntervalId: null,
			styleInjected: false,
		};
	},
	methods: {
		// 注入样式
		injectStyle() {
			if (this.styleInjected) return;
			$('head').append(`<style id="remove-post-avatar-style">
				.topic-list-data.posters { width: max-content !important; }
				.topic-list-content.right { margin-left:0 !important; }
				.topic-list-data.posters ${this.modelValue.showAuthor ? '> *:not(:first-child)' : ''},
				.topic-list-avatar.pull-left  { display:none !important }
				.topic-list td.topic-list-data.posters a:nth-child(1) span.poster-username{color:#999;font-size:12px;padding-left:2px;}
			</style>`);
			this.styleInjected = true;
		},
		// 处理话题列表，添加用户名
		processTopicList() {
			const showAuthorName = this.modelValue.showAuthorName;
			$('.topic-list td.topic-list-data.posters').each(function () {
				const $this = $(this);
				const $existingUsername = $this.find('.poster-username');

				// 如果不显示用户名，移除已存在的
				if (!showAuthorName) {
					$existingUsername.remove();
					return;
				}

				// 跳过已处理的元素
				if ($existingUsername.length > 0) return;

				const title = $this.find('a:nth-child(1) img').attr('title');
				if (title) {
					const username = title.split(' - ')[0].trim();
					$this.find('a:nth-child(1)').append(`<span class="poster-username">${username}</span>`);
				}
			});
		},
		// 初始化定时器
		initTimers() {
			this.clearTimers();

			// 注入样式
			this.injectStyle();

			// 立即执行一次
			this.processTopicList();

			// 设置短间隔更新定时器 (1秒)
			this.updateIntervalId = setInterval(() => {
				this.processTopicList();
			}, 1000);

			// 设置长间隔轮询定时器 (10秒)
			this.pollingIntervalId = setInterval(() => {
				this.processTopicList();
			}, 10000);
		},
		// 清除所有定时器
		clearTimers() {
			if (this.updateIntervalId) {
				clearInterval(this.updateIntervalId);
				this.updateIntervalId = null;
			}
			if (this.pollingIntervalId) {
				clearInterval(this.pollingIntervalId);
				this.pollingIntervalId = null;
			}
		},
	},
	mounted() {
		if (this.modelValue.enable) {
			this.initTimers();
		}
	},
	beforeUnmount() {
		this.clearTimers();
	},
	// Vue 2 兼容性
	beforeDestroy() {
		this.clearTimers();
	},
	watch: {
		'modelValue.enable'(newVal) {
			if (newVal) {
				this.initTimers();
			} else {
				this.clearTimers();
			}
		},
		'modelValue.showAuthor'() {
			// showAuthor 变化时重新注入样式
			if (this.modelValue.enable) {
				$('#remove-post-avatar-style').remove();
				this.styleInjected = false;
				this.injectStyle();
			}
		},
		'modelValue.showAuthorName'() {
			// showAuthorName 变化时重新处理列表
			if (this.modelValue.enable) {
				this.processTopicList();
			}
		},
	},
};
</script>

<style scoped lang="less">
#linuxdoscripts .menu-body-item .item .tit {
	line-height: 2;
}

#linuxdoscripts .menu-body-item .item .tit span {
	width: 100%;
	display: inline-flex;
	align-items: center;
	padding-left: 16px;

	input {
		margin-left: 5px;
	}
}
</style>
