<template>
  <ul class="list" v-if="this.list.length > 0">
    <li v-for="item in list" :key="item.id" class="news-item">
      <div class="news-content">
        <a
          :href="'https://linux.do/t/topic/' + item.id"
          target="_blank"
          class="news-link"
          :ref="`link-${item.id}`"
          @mouseenter="showTooltip($event, item.title)"
          @mouseleave="hideTooltip"
        >
          {{ item.title }}
        </a>
        <em>{{ item.highest_post_number }}</em>
      </div>
    </li>
  </ul>
  <div class="nodata" v-else>暂无最新话题</div>

  <!-- 自定义 tooltip -->
  <div v-if="tooltip.show" class="custom-tooltip" :style="tooltip.style">
    {{ tooltip.text }}
  </div>
</template>

<script>
export default {
  props: ["list"],
  emits: ["remove-item"],
  data() {
    return {
      tooltip: {
        show: false,
        text: "",
        style: {},
      },
    };
  },
  methods: {
    // 检测文字是否被截断
    isTextTruncated(element) {
      return element.scrollWidth > element.clientWidth;
    },

    // 显示 tooltip
    showTooltip(event, text) {
      const linkElement = event.target;

      // 只有当文字被截断时才显示 tooltip
      if (!this.isTextTruncated(linkElement)) {
        return;
      }

      const rect = linkElement.getBoundingClientRect();

      this.tooltip = {
        show: true,
        text: text,
        style: {
          position: "fixed",
          top: rect.top - 35 + "px",
          left: rect.left + "px",
          maxWidth: "300px",
          zIndex: 9999,
        },
      };
    },

    // 隐藏 tooltip
    hideTooltip() {
      this.tooltip.show = false;
    },
  },
};
</script>

<style scoped>
.news-item {
  margin-bottom: 4px;
}

.news-content {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  min-height: 20px; /* 固定最小行高 */
  width: 100%;
  overflow: hidden; /* 防止内容溢出 */
}

.preview-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px 6px; /* 增加垂直 padding 来扩大点击区域 */
  margin: -6px -2px; /* 负 margin 抵消 padding 对布局的影响 */
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  min-width: 24px; /* 确保最小点击宽度 */
}

.preview-btn:hover {
  background-color: #f0f0f0;
  color: #1890ff;
}

.preview-btn svg {
  width: 14px;
  height: 14px;
}

.news-link {
  flex: 1;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2; /* 控制文字行高 */
  min-width: 0; /* 允许 flex 项目收缩到内容宽度以下 */
}

.news-link:hover {
  color: #1890ff;
}

.news-content em {
  font-style: normal;
  color: #999;
  font-size: 12px;
  flex-shrink: 0;
  line-height: 1.2; /* 控制数字行高 */
}

.custom-tooltip {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
