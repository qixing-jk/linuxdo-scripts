<template>
  <ul class="list" v-if="this.list.length > 0">
    <li v-for="item in list" :key="item.id" class="news-item hot">
      <div class="news-content">
        <a
          :href="'https://linux.do/t/topic/' + item.id"
          @click="handleLinkClick($event, item.id)"
          class="news-link">
          {{ item.title }}
        </a>
      </div>
      <div class="news-meta">
        <em>{{ item.highest_post_number }}</em>
      </div>
    </li>
  </ul>
  <div class="nodata" v-else>暂无最新话题</div>
</template>

<script>
export default {
  props: ['list'],
  emits: ['remove-item'],
  data() {
    return {};
  },
  methods: {
    async handleLinkClick(event, itemId) {
      // 阻止默认的链接行为
      event.preventDefault();

      // 构建目标 URL
      const targetUrl = `https://linux.do/t/topic/${itemId}`;

      try {
        const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

        // 查询当前活动的标签页
        const tabs = await new Promise((resolve) => {
          browserAPI.tabs.query({ active: true, currentWindow: true }, resolve);
        });

        if (tabs.length > 0) {
          const currentTab = tabs[0];

          // 检查当前活动标签页是否为 linux.do
          if (currentTab.url && currentTab.url.includes('linux.do')) {
            // 如果当前标签页是 linux.do，直接在当前标签页跳转
            browserAPI.tabs.update(currentTab.id, { url: targetUrl });
          } else {
            // 如果不是 linux.do，创建新标签页
            browserAPI.tabs.create({ url: targetUrl });
          }
        } else {
          // 如果无法获取标签页信息，默认创建新标签页
          browserAPI.tabs.create({ url: targetUrl });
        }
      } catch (error) {
        console.error('处理链接跳转失败：', error);
        // 出错时回退到新标签页打开
        window.open(targetUrl, '_blank');
      }

      // 向父组件发送移除事件
      this.$emit('remove-item', itemId);
    }
  }
};
</script>
