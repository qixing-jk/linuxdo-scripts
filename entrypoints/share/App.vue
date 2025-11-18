<template>
	<div class="body">
		<a-spin :loading="loading">
			<div
				class="images"
				v-if="isShow"
				ref="imagesContainer"
			>
				<div
					class="images-box"
					id="target"
				>
					<div class="title">{{ imagesData.title }}</div>
					<div class="author">
						<span>{{ imagesData.details.created_by.name || imagesData.details.created_by.username }}</span>
						<span>{{ formatDate(imagesData.created_at) }}</span>
					</div>
					<div
						class="markdown-body text"
						v-html="imagesData.post_stream.posts[0].cooked"
					></div>
				</div>
			</div>
			<div
				class="images"
				v-else
			>
				<a-empty />
			</div>
		</a-spin>
		<div class="container">
			<a-input
				v-model="postslink"
				placeholder="https://linux.do/t/topic/309543"
			/>
			<a-button
				type="primary"
				style="margin-top: 10px"
				@click="parseLink"
				:loading="loading"
				>解析链接</a-button
			>
			<div v-if="isShow">
				<a-divider />
				<p style="color: #999; font-size: 14px; margin-bottom: 10px">
					建议下载图片更清晰，尚未解决复制到剪切板时失真问题。
				</p>
				<a-space>
					<a-button
						@click="copyToImageWithSnapdom"
						:loading="loading1"
						>复制图片</a-button
					>
					<a-button
						@click="downloadWithSnapdom"
						:loading="loading3"
						>下载图片</a-button
					>
				</a-space>
			</div>
			<!-- 隐藏的输出区域 -->
			<div
				id="export-output"
				style="display: none"
			></div>
		</div>
	</div>
</template>

<script>
import { snapdom } from '@zumer/snapdom';

export default {
	data() {
		return {
			isShow: false,
			postslink: '',
			loading: false,
			loading1: false,
			loading3: false,
			imagesData: {},
		};
	},
	methods: {
		// 使用 snapdom 捕获元素
		async captureDemo(id, outputId, btn) {
			const el = id === 'body' ? document.body : document.getElementById(id);

			const output = document.getElementById(outputId);
			if (!el || !output) return;
			if (btn) btn.disabled = true;

			const img = await snapdom.toImg(el, {
				embedFonts: id === 'body' || id === 'fonts-box' ? true : false,
				scale: 2,
				width: 1000,
				fast: id !== 'fonts-box' ? true : false,
				compress: id !== 'fonts-box' ? true : false,
			});
			output.innerHTML = '';
			output.appendChild(img);

			if (btn) btn.disabled = false;

			this.copyImageToClipboard('#export-output img')
				.then(() => {
					this.$message.success('图片已复制到剪贴板');
					this.loading1 = false;
				})
				.catch((err) => console.error('复制失败：', err));
		},

		copyImageToClipboard(imgSelector) {
			return new Promise((resolve, reject) => {
				const imgElement = document.querySelector(imgSelector);

				// 检查图片是否存在
				if (!imgElement) {
					reject(new Error('无法找到图片元素'));
					return;
				}

				// 检查图片是否已加载
				if (!imgElement.complete) {
					imgElement.onload = () => processImage();
					imgElement.onerror = () => reject(new Error('图片加载失败'));
				} else {
					processImage();
				}

				function processImage(scale = 1.0) {
					// 创建 canvas 并绘制图片
					const canvas = document.createElement('canvas');

					// 根据缩放比例设置 canvas 尺寸
					canvas.width = imgElement.naturalWidth * scale;
					canvas.height = imgElement.naturalHeight * scale;

					const ctx = canvas.getContext('2d');
					// 将图像按比例绘制到调整大小后的 canvas 上
					ctx.drawImage(
						imgElement,
						0,
						0,
						imgElement.naturalWidth,
						imgElement.naturalHeight,
						0,
						0,
						canvas.width,
						canvas.height
					);

					// 将 canvas 转换为 blob
					canvas.toBlob((blob) => {
						// 创建 ClipboardItem
						const data = [new ClipboardItem({ 'image/png': blob })];

						// 写入剪贴板
						navigator.clipboard
							.write(data)
							.then(() => resolve(true))
							.catch((err) => reject(err));
					}, 'image/png');
				}

				// 使用示例：
				// processImage(0.5); // 缩小到 50%
				// processImage(2.0); // 放大到 200%
			});
		},

		copyToImageWithSnapdom() {
			this.loading1 = true;
			this.captureDemo('target', 'export-output', this);
		},
		// 使用 snapdom 下载图像
		async downloadWithSnapdom() {
			this.loading3 = true;
			try {
				const targetElement = document.getElementById('target');
				if (!targetElement) {
					throw new Error('目标元素不存在');
				}

				await snapdom.download(targetElement, {
					format: 'png',
					filename: this.imagesData.title || 'linux-do-post',
					scale: 2,
					quality: 1,
					embedFonts: true,
				});

				this.$message.success('开始下载');
			} catch (error) {
				console.error('Snapdom 下载失败：', error);
				this.$message.error('下载失败');
			} finally {
				this.loading3 = false;
			}
		},

		// 使用 snapdom 导出为不同格式
		async exportToFormats(id) {
			const el = document.getElementById(id);
			if (!el) return null;

			try {
				const [png, jpg, webp] = await Promise.all([snapdom.toPng(el), snapdom.toJpg(el), snapdom.toWebp(el)]);

				return { png, jpg, webp };
			} catch (error) {
				console.error('导出格式失败：', error);
				return null;
			}
		},

		// 解析链接
		async parseLink() {
			if (this.postslink == '') {
				this.$message.warning('请输入链接！');
				return false;
			}
			this.loading = true;
			try {
				const url = new URL(this.postslink);
				const pathname = url.pathname;
				const [section, topic, id, page] = pathname.split('/').filter(Boolean);

				function convertOneboxToLink(data) {
					const parser = new DOMParser();
					const doc = parser.parseFromString(data.post_stream.posts[0].cooked, 'text/html');
					const oneboxElements = doc.querySelectorAll('.onebox');

					oneboxElements.forEach((onebox) => {
						const oneboxSrc = onebox.getAttribute('data-onebox-src');
						if (oneboxSrc) {
							const link = doc.createElement('a');
							link.href = oneboxSrc;
							link.textContent = oneboxSrc;
							onebox.parentNode.replaceChild(link, onebox);
						}
					});
					data.post_stream.posts[0].cooked = doc.body.innerHTML;
					return data;
				}

				const response = await fetch(`https://linux.do/t/${id}.json`);
				const data = await response.json();
				const processedData = convertOneboxToLink(data);
				this.imagesData = processedData;
				this.isShow = true;
				// 等待 DOM 更新
				await this.$nextTick();
				this.loading = false;
				this.$message.success('解析成功！');
			} catch (error) {
				this.$message.error('请求频繁，请稍后重试！');
				this.loading = false;
			}
		},

		// 转化时间格式
		formatDate(dateString) {
			if (!dateString) return '';
			const date = new Date(dateString);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},
	},
	created() {
		const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
		browserAPI.storage.local.get('shareID', (result) => {
			if (result.shareID) {
				this.postslink = `https://linux.do/t/topic/${result.shareID}`;
				this.parseLink();
				// 处理完后立即清除 storage 中的数据
				browserAPI.storage.local.remove('shareID');
			}
		});
	},
};
</script>
