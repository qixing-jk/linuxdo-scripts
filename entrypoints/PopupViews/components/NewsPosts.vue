<template>
  <ul class="list" v-if="this.list.length > 0">
    <li v-for="item in list" :key="item.id" class="news-item">
      <!-- 当 isReadonlyBefore 为 true 时，将按钮放在最前方 -->
      <button
        v-if="isReadonlyBefore"
        class="preview-btn preview-btn-before"
        @click="previewPost(item.id)"
        title="设为已读"
      >
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
      <div class="news-content">
        <a
          :href="'https://linux.do/t/topic/' + item.id"
          @click="handleLinkClick($event, item.id)"
          class="news-link"
        >
          {{ item.title }}
        </a>
      </div>
      <div class="news-meta">
        <!-- 当 isReadonlyBefore 为 false 时，将按钮放在右侧 -->
        <button
          v-if="!isReadonlyBefore"
          class="preview-btn"
          @click="previewPost(item.id)"
          title="设为已读"
        >
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
        <em>{{ item.highest_post_number }}</em>
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
      isReadonlyBefore: false,
    };
  },
  methods: {
    async handleLinkClick(event, itemId) {
      // 阻止默认的链接行为
      event.preventDefault();

      // 构建目标 URL
      const targetUrl = `https://linux.do/t/topic/${itemId}`;

      try {
        const browserAPI = typeof browser !== "undefined" ? browser : chrome;

        // 查询当前活动的标签页
        const tabs = await new Promise((resolve) => {
          browserAPI.tabs.query({ active: true, currentWindow: true }, resolve);
        });

        if (tabs.length > 0) {
          const currentTab = tabs[0];

          // 检查当前活动标签页是否为 linux.do
          if (currentTab.url && currentTab.url.includes("linux.do")) {
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
        console.error("处理链接跳转失败：", error);
        // 出错时回退到新标签页打开
        window.open(targetUrl, "_blank");
      }

      // 向父组件发送移除事件
      this.$emit("remove-item", itemId);
    },

    previewPost(itemId) {
      // 后台预览帖子，保持用户登录状态
      console.log("开始后台预览帖子：", itemId);
      this.loadPostInBackground(`https://linux.do/t/topic/${itemId}`);
      // 预览后也移除这条目
      this.$emit("remove-item", itemId);
      this.$message.success("设为已读！");
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

    handleStorageChange(e) {
      // 添加安全检查
      if (!e || typeof e.key !== "string") {
        console.warn("storage 事件对象异常：", e);
        return;
      }

      if (e.key === "isReadonlyBefore") {
        const newValue = e.newValue;
        if (newValue !== null && newValue !== undefined) {
          try {
            this.isReadonlyBefore = JSON.parse(newValue);
          } catch (error) {
            console.error("解析 localStorage 值失败：", error, newValue);
          }
        }
      }
    },

    handleReadonlyBeforeChanged(e) {
      // 添加安全检查
      if (!e || !e.detail || typeof e.detail.isReadonlyBefore === "undefined") {
        console.warn("自定义事件对象异常：", e);
        return;
      }

      console.log("接收到设置变更事件：", e.detail);
      this.isReadonlyBefore = e.detail.isReadonlyBefore;
    },
  },
  watch: {
    // 监听 isReadonlyBefore 的变化，实时更新布局
    isReadonlyBefore: {
      handler(newVal, oldVal) {
        console.log("isReadonlyBefore 发生变化：", newVal, "(从", oldVal, ")");
        // Vue 的响应式系统会自动处理重新渲染，通常不需要手动 forceUpdate
        // 如果确实需要强制更新，添加安全检查
        if (this.$forceUpdate && typeof this.$forceUpdate === "function") {
          this.$nextTick(() => {
            this.$forceUpdate();
          });
        }
      },
      immediate: false, // 改为 false，避免在初始化时触发不必要的更新
    },
  },
  created() {
    // 从 localStorage 获取 isReadonlyBefore 设置
    try {
      const isReadonlyBefore = localStorage.getItem("isReadonlyBefore");
      if (isReadonlyBefore !== null) {
        this.isReadonlyBefore = JSON.parse(isReadonlyBefore);
      }
    } catch (error) {
      console.error("初始化读取 localStorage 失败：", error);
      this.isReadonlyBefore = false; // 设置默认值
    }

    // 安全地添加事件监听器
    try {
      // 监听 localStorage 的变化
      window.addEventListener("storage", this.handleStorageChange);

      // 监听自定义的设置变更事件
      window.addEventListener("readonlyBeforeChanged", this.handleReadonlyBeforeChanged);
    } catch (error) {
      console.error("添加事件监听器失败：", error);
    }
  },
  beforeDestroy() {
    // 安全地移除事件监听器
    try {
      window.removeEventListener("storage", this.handleStorageChange);
      window.removeEventListener(
        "readonlyBeforeChanged",
        this.handleReadonlyBeforeChanged
      );
    } catch (error) {
      console.error("移除事件监听器失败：", error);
    }
  },
};
</script>
