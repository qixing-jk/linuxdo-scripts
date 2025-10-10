<template>
  <div class="item">
    <div class="tit">{{ sort }}. 自定义 CSS（支持 import 引入第三方样式文件）</div>
  </div>
  <textarea v-model="textarea" @input="handleChange" placeholder="body{font-size:16px;}">
  </textarea>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      textarea: this.value,
      styleElement: null, // 存储 body 后的 style 元素
      shadowStyleElement: null, // 存储 shadow DOM 中的 style 元素
    };
  },
  watch: {
    value(newValue) {
      this.textarea = newValue;
      // 当数据从 IndexedDB 加载完成后，应用 CSS
      if (newValue) {
        if (!this.styleElement) {
          this.applyCSS();
        } else {
          this.updateCSS();
        }
      }
    },
    textarea(newValue) {
      // 当用户修改 CSS 时，更新已应用的样式
      if (newValue && this.styleElement) {
        this.updateCSS();
      } else if (newValue && !this.styleElement) {
        // 如果还没有应用过 CSS，则首次应用
        this.applyCSS();
      } else if (!newValue && this.styleElement) {
        // 如果清空了内容，移除样式
        this.removeCSS();
      }
    },
  },
  methods: {
    handleChange() {
      this.$emit("update:value", this.textarea);
    },
    applyCSS() {
      if (!this.textarea) {
        return;
      }
   
      // 在 body 添加 style 标签
      const style = document.createElement('style');
      style.setAttribute('data-source', 'linuxdo-scripts-custom-css');
      style.textContent = this.textarea;
      document.body.appendChild(style);
      this.styleElement = style;
      
      // 延迟注入到 shadow DOM
      setTimeout(() => {
        this.applyShadowCSS();
      }, 1000);
    },
    applyShadowCSS() {
      if (!this.textarea) return;
      
      const hostElement = $('linuxdo-scripts-ui[data-wxt-shadow-root]')[0];
      if (hostElement && hostElement.shadowRoot) {
        const styleElement = document.createElement('style');
        styleElement.textContent = this.textarea;
        hostElement.shadowRoot.appendChild(styleElement);
        this.shadowStyleElement = styleElement;
      }
    },
    updateCSS() {
      // 更新 body 中的样式
      if (this.styleElement) {
        this.styleElement.textContent = this.textarea;
      }
      
      // 更新 shadow DOM 中的样式
      if (this.shadowStyleElement) {
        this.shadowStyleElement.textContent = this.textarea;
      }
    },
    removeCSS() {
      // 清理 body 中的样式
      if (this.styleElement && this.styleElement.parentNode) {
        this.styleElement.parentNode.removeChild(this.styleElement);
        this.styleElement = null;
      }
      
      // 清理 shadow DOM 中的样式
      if (this.shadowStyleElement && this.shadowStyleElement.parentNode) {
        this.shadowStyleElement.parentNode.removeChild(this.shadowStyleElement);
        this.shadowStyleElement = null;
      }
    },
  },
  mounted() {
    // 使用 mounted 而不是 created，确保 DOM 已就绪
    // 同时给父组件一些时间从 IndexedDB 加载数据
    this.$nextTick(() => {
      if (this.textarea) {
        this.applyCSS();
      }
    });
  },
  beforeDestroy() {
    // 组件销毁前清理样式
    this.removeCSS();
  },
};
</script>

<style lang="less" scoped>
.item {
  border: none !important;

  a:hover {
    text-decoration: underline;
  }
}
</style>
