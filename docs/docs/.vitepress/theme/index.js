import DefaultTheme from 'vitepress/theme';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';
import { h } from 'vue';

// 引入组件
import GitHubStar from '../components/githubStar.vue';
import './custom.css';
import Layout from './Layout.vue';

// 图片放大
import { onMounted, watch, nextTick } from 'vue';
import mediumZoom from 'medium-zoom';

// 代码块添加折叠功能
import codeblocksFold from 'vitepress-plugin-codeblocks-fold';
import 'vitepress-plugin-codeblocks-fold/style/index.scss';

export default {
	...DefaultTheme,
	Layout() {
		const Layout = DefaultTheme.Layout;
		return h(Layout, null, {
			'nav-bar-content-after': () => h(GitHubStar),
		});
	},
	enhanceApp(ctx) {
		DefaultTheme.enhanceApp(ctx);
	},
	setup() {
		const { frontmatter } = useData();
		const route = useRoute();
		const initZoom = () => {
			mediumZoom('.main img', { background: 'var(--vp-c-bg)' });
		};
		onMounted(() => {
			initZoom();
		});
		watch(
			() => route.path,
			() => nextTick(() => initZoom()),
		);

		codeblocksFold({ route, frontmatter }, true, 600);

		// Obtain configuration from: https://giscus.app/
		giscusTalk(
			{
				repo: 'anghunk/linuxdo-scripts',
				repoId: 'R_kgDOMfjPXA',
				category: 'Announcements', // default: `General`
				categoryId: 'DIC_kwDOMfjPXM4Chc6M',
				mapping: 'pathname', // default: `pathname`
				inputPosition: 'top', // default: `top`
				lang: 'zh-CN', // default: `zh-CN`
				// i18n setting (Note: This configuration will override the default language set by lang)
				// Configured as an object with key-value pairs inside:
				// [your i18n configuration name]: [corresponds to the language pack name in Giscus]
				locales: {
					'zh-Hans': 'zh-CN',
					'en-US': 'en',
				},
				homePageShowComment: true, // Whether to display the comment area on the homepage, the default is false
				lightTheme: 'preferred_color_scheme', // default: `light`
				darkTheme: 'transparent_dark', // default: `transparent_dark`
				// ...
			},
			{
				frontmatter,
				route,
			},
			// Whether to activate the comment area on all pages.
			// The default is true, which means enabled, this parameter can be ignored;
			// If it is false, it means it is not enabled.
			// You can use `comment: true` preface to enable it separately on the page.
			true,
		);
	},
};
