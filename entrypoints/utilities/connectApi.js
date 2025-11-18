/**
 * Connect API 工具函数
 * 用于与 https://connect.linux.do/ 接口进行通信
 * 通过 background script 绕过 CORS 限制
 */

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

/**
 * 获取 connect.linux.do 的数据
 * @param {string} endpoint - API 端点，例如 '/api/data' 或 '/'
 * @param {Object} options - 可选的请求配置
 * @param {string} options.method - HTTP 方法，默认为 'GET'
 * @param {Object} options.headers - 额外的请求头
 * @param {Object|string} options.body - 请求体数据
 * @returns {Promise} 返回 API 响应的 Promise
 */
export async function fetchConnectData(endpoint = '', options = {}) {
	return new Promise((resolve, reject) => {
		// 发送消息到 background script，利用扩展权限绕过 CORS
		browserAPI.runtime.sendMessage(
			{
				action: 'fetch_connect_data',
				endpoint: endpoint,
				options: options,
			},
			(response) => {
				if (browserAPI.runtime.lastError) {
					reject(new Error(browserAPI.runtime.lastError.message));
					return;
				}

				if (response && response.success) {
					resolve(response);
				} else {
					const errorMsg = response?.error || '未知错误';
					const url = response?.url || `https://connect.linux.do${endpoint}`;
					reject(new Error(`请求失败：${errorMsg} (URL: ${url})`));
				}
			}
		);
	});
}

/**
 * 获取 connect.linux.do 首页数据
 * @returns {Promise} 返回首页数据的 Promise
 */
export async function getConnectHome() {
	try {
		const response = await fetchConnectData('/');
		return {
			success: true,
			data: response.data,
			status: response.status,
			url: response.url,
		};
	} catch (error) {
		console.error('获取 Connect 首页数据失败：', error);
		return {
			success: false,
			error: error.message,
		};
	}
}

/**
 * 获取 connect.linux.do 的 API 数据
 * @param {string} apiPath - API 路径，例如 '/api/users' 或 '/api/posts'
 * @returns {Promise} 返回 API 数据的 Promise
 */
export async function getConnectApiData(apiPath) {
	try {
		const response = await fetchConnectData(apiPath);
		return {
			success: true,
			data: response.data,
			status: response.status,
			url: response.url,
			headers: response.headers,
		};
	} catch (error) {
		console.error(`获取 Connect API 数据失败 (${apiPath}):`, error);
		return {
			success: false,
			error: error.message,
			path: apiPath,
		};
	}
}

/**
 * POST 请求到 connect.linux.do
 * @param {string} endpoint - API 端点
 * @param {Object} data - 要发送的数据
 * @param {Object} extraHeaders - 额外的请求头
 * @returns {Promise} 返回 API 响应的 Promise
 */
export async function postConnectData(endpoint, data, extraHeaders = {}) {
	const options = {
		method: 'POST',
		headers: {
			...extraHeaders,
		},
	};

	if (data) {
		if (typeof data === 'object') {
			options.body = JSON.stringify(data);
			options.headers['Content-Type'] = 'application/json';
		} else {
			options.body = data;
		}
	}

	try {
		const response = await fetchConnectData(endpoint, options);
		return {
			success: true,
			data: response.data,
			status: response.status,
			url: response.url,
		};
	} catch (error) {
		console.error(`POST 请求到 Connect 失败 (${endpoint}):`, error);
		return {
			success: false,
			error: error.message,
			endpoint: endpoint,
		};
	}
}

/**
 * 测试 connect.linux.do 连接
 * @returns {Promise} 返回连接测试结果
 */
export async function testConnectConnection() {
	try {
		const startTime = Date.now();
		const response = await fetchConnectData('/');
		const endTime = Date.now();
		const responseTime = endTime - startTime;

		return {
			success: true,
			status: response.status,
			responseTime: responseTime,
			message: `连接成功 (${responseTime}ms)`,
		};
	} catch (error) {
		return {
			success: false,
			error: error.message,
			message: '连接失败',
		};
	}
}
