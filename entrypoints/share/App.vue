<template>
	<div class="body">
		<a-spin :loading="loading">
			<div class="images" v-if="isShow" ref="imagesContainer">
				<div class="images-box" id="target">
					<div class="title">{{ imagesData.title }}</div>
					<div class="author">
						<span>{{ imagesData.details.created_by.name || imagesData.details.created_by.username }}</span>
						<span>{{ formatDate(imagesData.created_at) }}</span>
					</div>
					<div class="markdown-body text" v-html="imagesData.post_stream.posts[0].cooked"></div>
				</div>
			</div>
			<div class="images" v-else>
				<a-empty />
			</div>
		</a-spin>
		<div class="container">
			<a-input v-model="postslink" placeholder="https://linux.do/t/topic/309543" />
			<a-button type="primary" style="margin-top: 10px" @click="parseLink" :loading="loading">解析链接</a-button>
			<div v-if="isShow">
				<a-divider />
				<p style="color: #999; font-size: 14px; margin-bottom: 10px">✨ 使用 html2canvas 库，完美支持跨域图片渲染。</p>
				<a-space>
					<a-button @click="copyToImageWithHtml2canvas" :loading="loading1">复制图片</a-button>
					<a-button @click="downloadWithHtml2canvas" :loading="loading3">下载图片</a-button>
				</a-space>
			</div>
			<!-- 隐藏的输出区域 -->
			<div id="export-output" style="display: none"></div>
		</div>
	</div>
</template>

<script>
import html2canvas from 'html2canvas';

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
		// 使用 html2canvas 捕获元素
		async captureDemo(id, outputId) {
			const el = id === 'body' ? document.body : document.getElementById(id);
			const output = document.getElementById(outputId);

			if (!el || !output) return;

			try {
				this.$message.loading('正在生成图片...');

				// 获取元素实际宽度
				const elementWidth = el.offsetWidth;

				const canvas = await html2canvas(el, {
					scale: 2, // 2倍分辨率
					useCORS: true, // 允许跨域图片
					allowTaint: true, // 允许跨域污染
					backgroundColor: '#F9F1E4', // 背景色
					logging: false, // 关闭日志
					// 使用元素实际宽度，不强制指定
					// width: elementWidth,
					// windowWidth: elementWidth,
				});

				// 将 canvas 转换为图片
				const img = new Image();
				img.src = canvas.toDataURL('image/png', 1.0);

				output.innerHTML = '';
				output.appendChild(img);

				return canvas;
			} catch (error) {
				console.error('捕获图片失败：', error);
				this.$message.error('生成图片失败：' + error.message);
				throw error;
			}
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
						canvas.height,
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

		async copyToImageWithHtml2canvas() {
			this.loading1 = true;
			try {
				await this.captureDemo('target', 'export-output');

				await this.copyImageToClipboard('#export-output img');
				this.$message.success('图片已复制到剪贴板');
			} catch (error) {
				console.error('复制失败：', error);
				this.$message.error('复制失败：' + error.message);
			} finally {
				this.loading1 = false;
			}
		},

		// 使用 html2canvas 下载图像
		async downloadWithHtml2canvas() {
			this.loading3 = true;
			try {
				const targetElement = document.getElementById('target');
				if (!targetElement) {
					throw new Error('目标元素不存在');
				}

				this.$message.loading('正在生成图片...');

				const canvas = await html2canvas(targetElement, {
					scale: 2,
					useCORS: true,
					allowTaint: true,
					backgroundColor: '#F9F1E4',
					logging: false,
					// 不强制指定宽度，使用元素实际宽度
				});

				// 转换为 Blob 并下载
				canvas.toBlob(
					(blob) => {
						const url = URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = url;
						link.download = `${this.imagesData.title || 'linux-do-post'}.png`;
						link.click();
						URL.revokeObjectURL(url);

						this.$message.success('开始下载');
					},
					'image/png',
					1.0,
				);
			} catch (error) {
				console.error('下载失败：', error);
				this.$message.error('下载失败：' + error.message);
			} finally {
				this.loading3 = false;
			}
		},

		// 使用 html2canvas 导出为不同格式（预留方法）
		async exportToFormats(id) {
			const el = document.getElementById(id);
			if (!el) return null;

			try {
				const canvas = await html2canvas(el, {
					scale: 2,
					useCORS: true,
					allowTaint: true,
				});

				const png = canvas.toDataURL('image/png', 1.0);
				const jpg = canvas.toDataURL('image/jpeg', 0.95);
				const webp = canvas.toDataURL('image/webp', 0.95);

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
