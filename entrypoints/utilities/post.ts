import { isQueryParamEqual } from './url';

/**
 * 是否为免打扰帖子页面（即 state=muted）
 * @param {string} [url] - 可选，自定义 URL，默认使用 window.location.search
 * @returns {boolean}
 */
export function isMutedPostPage(url?: string) {
	return isQueryParamEqual('state', 'muted', url);
}
