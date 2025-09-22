<template>
  <ul class="list" v-if="this.list.length > 0">
    <li v-for="item in list" :key="item.id" class="news-item">
      <div class="news-content">
        <a
          :href="'https://linux.do/t/topic/' + item.id"
          target="_blank"
          @click="handleLinkClick(item.id)"
          class="news-link"
        >
          {{ item.title }}
        </a>
        <em>{{ item.highest_post_number }}</em>
        <button class="preview-btn" @click="previewPost(item.id)" title="设为已读">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6" />
          </svg>
        </button>
      </div>
    </li>
  </ul>
  <div class="nodata" v-else>暂无最新话题</div>
</template>

<script>
export default {
  props: ["list"],
  emits: ["remove-item"],
  data() {
    return {
   
    };
  },
  methods: {
    handleLinkClick(itemId) {
      // 点击链接时，向父组件发送移除事件
      this.$emit("remove-item", itemId);
      // 链接的默认行为（跳转）会正常执行
    },

    previewPost(itemId) {
      // 后台预览帖子，保持用户登录状态
      console.log("开始后台预览帖子：", itemId);
      this.loadPostInBackground(`https://linux.do/t/topic/${itemId}`);
      // 预览后也移除这条目
      this.$emit("remove-item", itemId);
      this.$message.success('设为已读！')
    },

    loadPostInBackground(url) {
      // 创建隐藏的 iframe 来加载页面，保持用户登录状态
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.src = url;

      // 监听加载完成
      iframe.onload = () => {
        console.log("后台预览完成：", url);
        // 延迟移除 iframe，确保页面完全加载
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      };

      // 错误处理
      iframe.onerror = () => {
        console.error("后台预览失败：", url);
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      };

      // 添加到页面
      document.body.appendChild(iframe);
    },

  },
};
</script>
