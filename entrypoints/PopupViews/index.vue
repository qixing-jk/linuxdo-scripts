<template>
	<div class="nav-wrap">
		<ul class="nav">
			<li :class="{ act: activeTab === 'hot' }" @click="changeTab('hot')">最热</li>
			<li :class="{ act: activeTab === 'news' }" @click="changeTab('news')">最新</li>
			<li :class="{ act: activeTab === 'book' }" @click="changeTab('book')">收藏</li>
			<li :class="{ act: activeTab === 'LDC' }" @click="changeTab('LDC')">LDC</li>
			<li :class="{ act: activeTab === 'menu' }" @click="changeTab('menu')">菜单</li>
		</ul>
		<div class="fixed-icon">
			<div class="item" title="10分钟自动刷新一次" :class="{ loading: isRefresh }" @click="refresh">
				<Refresh />
			</div>
		</div>
	</div>

	<div class="container" ref="container">
		<div class="content" :class="{ act: activeTab === 'hot' }">
			<HotPosts v-if="hotlist.length > 0" :list="hotlist" />
			<p v-else>{{ nohotlist }}</p>
		</div>
		<div class="content" :class="{ act: activeTab === 'news' }">
			<NewsPosts v-if="newslist.length > 0" :list="newslist" @remove-item="removeNewsItem" />
			<p v-else>{{ nonewlist }}</p>
		</div>
		<div class="content" :class="{ act: activeTab === 'book' }">
			<Bookmark :bookmarkData="bookmarkDataList" />
		</div>
		<div class="content" :class="{ act: activeTab === 'LDC' }">
			<LDC :userInfo="ldcUserInfo" :integralInfo="ldcIntegralInfo" />
		</div>
		<div class="content" :class="{ act: activeTab === 'menu' }">
			<SettingMenu />
		</div>
	</div>
</template>

<script>
import './style.less';
import HotPosts from './components/HotPosts.vue';
import NewsPosts from './components/NewsPosts.vue';
import Bookmark from './components/Bookmark.vue';
import LDC from './components/LDC.vue';
import SettingMenu from './components/SettingMenu.vue';
import Refresh from './components/SVG/Refresh.vue';

export default {
	data() {
		return {
			isRefresh: false,
			activeTab: 'news',
			hotlist: [], // 热门列表
			newslist: [], // 最新列表
			ldcUserInfo: {}, // LDC 用户信息
			ldcIntegralInfo: [], // LDC 7天积分情况

			nohotlist: '暂无热帖',
			nonewlist: '暂无新帖',

			lastScrollPosition: 0, // 存储滚动位置

			themes: 'light', // 主题风格

			// 从 bookmark 页面共享的书签数据（localStorage: bookmarkData）
			bookmarkDataList: [],
		};
	},
	components: {
		HotPosts,
		NewsPosts,
		Bookmark,
		LDC,
		SettingMenu,
		Refresh,
	},
	methods: {
		// 平滑滚动到顶部
		scrollToTop() {
			const container = this.$refs.container;
			if (container) {
				container.scrollTo({
					top: 0,
					behavior: 'smooth', // 平滑滚动
				});
			}
		},
		// 切换菜单
		changeTab(tab) {
			this.activeTab = tab;
			this.scrollToTop();
			localStorage.setItem('activeTab', this.activeTab);
		},
		// 获取热门列表
		async getHotPosts() {
			// this.hotlist = [];
			fetch('https://linux.do/top.json')
				.then((response) => response.json())
				.then((data) => {
					this.hotlist = data.topic_list.topics;
					localStorage.setItem('hotlist', JSON.stringify(this.hotlist));
					this.isRefresh = false;
				})
				.catch((error) => {
					this.nohotlist = '网络异常';
					this.isRefresh = false;
				});
		},
		// 获取最新列表
		async getNewsPosts() {
			// this.newslist = [];
			fetch('https://linux.do/new.json')
				.then((response) => response.json())
				.then((data) => {
					this.newslist = data.topic_list.topics;
					localStorage.setItem('newslist', JSON.stringify(this.newslist));
					this.isRefresh = false;
				})
				.catch((error) => {
					this.nonewlist = '网络异常';
					this.isRefresh = false;
				});
		},
		// 获取 LDC 用户信息
		async getLDCUserInfo() {
			fetch('https://credit.linux.do/api/v1/oauth/user-info')
				.then((response) => response.json())
				.then((data) => {
					this.ldcUserInfo = data.data;
					localStorage.setItem('ldcUserInfo', JSON.stringify(this.ldcUserInfo));
					this.isRefresh = false;
				})
				.catch((error) => {
					this.isRefresh = false;
				});
		},

		// 刷新
		refresh() {
			this.isRefresh = true;
			this.getHotPosts();
			this.getNewsPosts();
			this.getLDCUserInfo();
			this.getLDCIntegralInfo();
			localStorage.setItem('Timestamp', Date.now());
		},

		// 获取 7 天内LDC积分情况
		async getLDCIntegralInfo() {
			fetch('https://credit.linux.do/api/v1/dashboard/stats/daily?days=7')
				.then((response) => response.json())
				.then((data) => {
					this.ldcIntegralInfo = data.data || [];
					localStorage.setItem('ldcIntegralInfo', JSON.stringify(this.ldcIntegralInfo));
					this.isRefresh = false;
				})
				.catch((error) => {
					this.isRefresh = false;
				});
		},

		// 移除最新帖子项目
		removeNewsItem(itemId) {
			// 从当前列表中移除指定 ID 的项目
			this.newslist = this.newslist.filter((item) => item.id !== itemId);
			// 更新 localStorage 缓存
			localStorage.setItem('newslist', JSON.stringify(this.newslist));
		},

		// 当容器滚动时，记录当前位置
		recordScroll() {
			const container = this.$refs.container;
			if (container) {
				this.lastScrollPosition = container.scrollTop; // 保存滚动位置
				localStorage.setItem('lastScrollPosition', this.lastScrollPosition);
			}
		},

		// 恢复到之前保存的位置
		restoreScrollPosition() {
			const container = this.$refs.container;
			if (container) {
				container.scrollTo({
					top: this.lastScrollPosition, // 恢复上次保存的位置
					// behavior: "smooth", // 平滑滚动
				});
			}
		},

		// 获取本地存储中的书签数据
		getBookmarkDataFromLocalStorage() {
			try {
				const raw = localStorage.getItem('bookmarkData');
				if (!raw) return [];
				const parsed = JSON.parse(raw);
				return Array.isArray(parsed) ? parsed : [];
			} catch (e) {
				return [];
			}
		},

		// localStorage 变更监听（来自 bookmark 页面写入）
		handleLocalStorageChange(e) {
			if (e && e.key === 'bookmarkData') {
				this.bookmarkDataList = this.getBookmarkDataFromLocalStorage();
			}
		},

		// chrome.storage 变更监听（来自内容脚本/其他页面写入）
		handleChromeStorageChange(changes, area) {
			if (area !== 'local') return;
			if (changes.bookmarkData || changes.bookmarks) {
				// 主动同步 storage.local 中的临时数据到本地存储
				this.syncFromStorageLocal().then(() => {
					this.bookmarkDataList = this.getBookmarkDataFromLocalStorage();
				});
			}
		},

		// 将 storage.local 的数据合并进 localStorage('bookmarkData')
		async syncFromStorageLocal() {
			return new Promise((resolve) => {
				const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
				browserAPI.storage?.local.get(['bookmarkData', 'bookmarks'], (result) => {
					const local = this.getBookmarkDataFromLocalStorage();

					// 确保有默认列表 id=0
					let defaultList = local.find((item) => item.id === 0);
					if (!defaultList) {
						defaultList = { id: 0, name: '默认', list: [], sort: 1 };
						local.unshift(defaultList);
					}

					// 处理单个书签（向后兼容）
					if (result && result.bookmarkData) {
						const single = result.bookmarkData;
						// 去重：先从所有列表移除相同 URL
						local.forEach((folder) => {
							folder.list = (folder.list || []).filter((item) => item.url !== single.url);
						});
						// 添加到默认列表开头
						defaultList.list.unshift(single);
					}

					// 处理批量书签
					if (result && Array.isArray(result.bookmarks) && result.bookmarks.length > 0) {
						result.bookmarks.forEach((bm) => {
							// 如果已存在相同 URL，则更新；否则添加
							let updated = false;
							local.forEach((folder) => {
								const idx = (folder.list || []).findIndex((i) => i.url === bm.url);
								if (idx !== -1) {
									folder.list[idx] = { ...bm };
									updated = true;
								}
							});
							if (!updated) {
								defaultList.list.unshift({ ...bm });
							}
						});
					}

					// 持久化
					try {
						localStorage.setItem('bookmarkData', JSON.stringify(local));
					} catch (e) {}

					// 清理已消费的临时数据
					const removeKeys = [];
					if (result && result.bookmarkData) removeKeys.push('bookmarkData');
					if (result && result.bookmarks) removeKeys.push('bookmarks');
					if (removeKeys.length > 0) {
						browserAPI.storage?.local.remove(removeKeys, () => resolve());
					} else {
						resolve();
					}
				});
			});
		},
	},
	created() {
		// 获取风格主题
		const themes = localStorage.getItem('themes');
		if (themes) {
			this.themes = themes;
			if (this.themes == 'dark') {
				// 设置为暗黑主题
				document.body.setAttribute('arco-theme', 'dark');
			} else {
				// 恢复亮色主题
				document.body.removeAttribute('arco-theme');
			}
		}

		/* 找到上次打开的位置 */
		const activeTab = localStorage.getItem('activeTab');
		if (activeTab) {
			this.activeTab = activeTab;
		}
		const lastScrollPosition = localStorage.getItem('lastScrollPosition');
		if (lastScrollPosition) {
			this.lastScrollPosition = Number(lastScrollPosition); // 转换为数字

			// 滚动到之前保存的位置
			setTimeout(() => {
				this.restoreScrollPosition();
			}, 1);
		}
		this.recordScroll();
		/* 找到上次打开的位置 */

		const Timestamp = localStorage.getItem('Timestamp', Date.now());
		if (Timestamp) {
			const timeDiff = new Date() - Timestamp;
			if (timeDiff > 600000) {
				// 超过 10 分钟
				localStorage.removeItem('hotlist');
				localStorage.removeItem('newslist');
				localStorage.removeItem('ldcUserInfo');
				localStorage.removeItem('ldcIntegralInfo');
				localStorage.removeItem('Timestamp');
				localStorage.removeItem('activeTab');
				localStorage.setItem('Timestamp', Date.now());
			}
		} else {
			localStorage.setItem('Timestamp', Date.now());
		}

		const hotlist = localStorage.getItem('hotlist');
		if (hotlist) {
			this.hotlist = JSON.parse(hotlist);
		} else {
			this.getHotPosts(); // 获取热门列表
		}

		const newslist = localStorage.getItem('newslist');
		if (newslist) {
			this.newslist = JSON.parse(newslist);
		} else {
			this.getNewsPosts(); // 获取最新列表
		}

		const ldcUserInfo = localStorage.getItem('ldcUserInfo');
		if (ldcUserInfo) {
			this.ldcUserInfo = JSON.parse(ldcUserInfo);
		} else {
			this.getLDCUserInfo(); // 获取 LDC 用户信息
		}
		
		const ldcIntegralInfo = localStorage.getItem('ldcIntegralInfo');
		if (ldcIntegralInfo) {
			this.ldcIntegralInfo = JSON.parse(ldcIntegralInfo);
		} else {
			this.getLDCIntegralInfo(); // 获取 7 天内LDC积分情况
		}

		// 同步一次 storage.local -> localStorage，并初始化读取书签数据
		this.syncFromStorageLocal().then(() => {
			this.bookmarkDataList = this.getBookmarkDataFromLocalStorage();
		});

		// 监听 localStorage 与 chrome.storage 的变更
		window.addEventListener('storage', this.handleLocalStorageChange);
		const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
		browserAPI.storage?.onChanged?.addListener(this.handleChromeStorageChange);
	},
	// 绑定滚动事件，自动记录滚动位置
	mounted() {
		const container = this.$refs.container;
		if (container) {
			container.addEventListener('scroll', this.recordScroll); // 监听滚动事件
		}
	},
	// 解绑事件，防止内存泄漏
	beforeDestroy() {
		const container = this.$refs.container;
		if (container) {
			container.removeEventListener('scroll', this.recordScroll);
		}
		window.removeEventListener('storage', this.handleLocalStorageChange);
		const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
		browserAPI.storage?.onChanged?.removeListener?.(this.handleChromeStorageChange);
	},
};
</script>
