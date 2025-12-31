<template>
	<div class="ldc-container">
		<template v-if="userInfo.username">
			<div class="ldc-box">
				<div class="ldc-header">
					<div class="ldc-title">账户信息</div>
					<div class="ldc-username">
						<a href="https://credit.linux.do/home" target="_blank">
							<img :src="userInfo.avatar_url" :alt="userInfo.username" :title="userInfo.username" />
						</a>
					</div>
				</div>
				<div class="ldc-balance" style="font-weight: 600">
					<span class="balance-label">当前余额：</span>
					<span class="balance-value">{{ userInfo.available_balance || '加载中...' }}</span>
				</div>
				<div class="ldc-balance">
					<span class="balance-label">今日剩余额度：</span>
					<span>{{ userInfo.remain_quota || '加载中...' }}</span>
				</div>
			</div>
			<div class="ldc-box">
				<div class="ldc-header">
					<div class="ldc-title">收入统计</div>
				</div>
				<div class="chart-container">
					<div v-if="chartData.length > 0" class="bar-chart">
						<div v-for="(item, index) in chartData" :key="index" class="bar-item">
							<div class="bar-title">
								<div class="bar-label">{{ item.dateLabel }}</div>
								<div class="bar-value">{{ item.valueLabel }}</div>
							</div>
							<div class="bar-wrapper">
								<div class="bar-fill" :style="{ width: item.percentage + '%' }"></div>
							</div>
						</div>
					</div>
					<div v-else class="no-data">暂无数据</div>
				</div>
			</div>
			<div class="ldc-box">
				<div class="ldc-header">
					<div class="ldc-title">支出统计</div>
				</div>
				<div class="chart-container">
					<div v-if="expenseChartData.length > 0" class="bar-chart">
						<div v-for="(item, index) in expenseChartData" :key="index" class="bar-item">
							<div class="bar-title">
								<div class="bar-label">{{ item.dateLabel }}</div>
								<div class="bar-value expense-value">{{ item.valueLabel }}</div>
							</div>
							<div class="bar-wrapper">
								<div class="bar-fill expense-bar" :style="{ width: item.percentage + '%' }"></div>
							</div>
						</div>
					</div>
					<div v-else class="no-data">暂无数据</div>
				</div>
			</div>
		</template>
		<template v-else>
			请登录 <a href="https://credit.linux.do/home" target="_blank">https://credit.linux.do/home</a>
		</template>
	</div>
</template>

<script>
export default {
	props: {
		userInfo: {
			type: Object,
			default: () => ({}),
		},
		integralInfo: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		chartData() {
			if (!this.integralInfo || this.integralInfo.length === 0) return [];

			// 提取 income 数据并转换为数字
			const data = this.integralInfo.map((item) => ({
				date: item.date,
				value: parseFloat(item.income) || 0,
			}));

			// 反转数组，使最新日期在上面
			const reversedData = [...data].reverse();

			// 计算最大值用于百分比计算
			const maxValue = Math.max(...reversedData.map((d) => d.value), 1);

			// 格式化数据
			return reversedData.map((item) => {
				const date = new Date(item.date);
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

				return {
					dateLabel: `${month}/${day}`,
					value: item.value,
					valueLabel: item.value > 0 ? `+${item.value.toFixed(2)}` : `${item.value.toFixed(2)}`,
					percentage: percentage,
				};
			});
		},
		expenseChartData() {
			if (!this.integralInfo || this.integralInfo.length === 0) return [];

			// 提取 expense 数据并转换为数字
			const data = this.integralInfo.map((item) => ({
				date: item.date,
				value: parseFloat(item.expense) || 0,
			}));

			// 反转数组，使最新日期在上面
			const reversedData = [...data].reverse();

			// 计算最大值用于百分比计算
			const maxValue = Math.max(...reversedData.map((d) => d.value), 1);

			// 格式化数据
			return reversedData.map((item) => {
				const date = new Date(item.date);
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

				return {
					dateLabel: `${month}/${day}`,
					value: item.value,
					valueLabel: item.value > 0 ? `-${item.value.toFixed(2)}` : `${item.value.toFixed(2)}`,
					percentage: percentage,
				};
			});
		},
	},
};
</script>
