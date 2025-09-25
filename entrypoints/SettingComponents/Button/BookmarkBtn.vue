<template>
  <div>
    <div class="el-button linuxdoscripts-bookmark1" @click="bookmark" title="收藏">
      收藏
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      silentBookmark: false,
      bookmarkIntervalId: null, // 添加变量存储定时器 ID
    };
  },
  methods: {
    // 提示组件
    messageToast(message) {
      const messageElement = document.createElement("div");
      messageElement.className = "messageToast-text";
      messageElement.innerText = message;
      document.getElementById("messageToast").appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },

    bookmark() {
      if ($(".header-title .topic-link").text().trim() == "") {
        this.messageToast("请将页面往下滑动一点点，再点击收藏！");
        return false;
      }
      var bookmarkDatatitle = $(".header-title .topic-link").text().trim();
      var bookmarkDatacate = $(
        ".categories-wrapper .badge-category__wrapper:nth-child(1) .badge-category__name"
      )
        .text()
        .trim();
      var bookmarkDatatags = $("#topic-title .discourse-tags .discourse-tag.box")
        .map(function () {
          return $(this).text().trim();
        })
        .get();
      var bookmarkDataurl =
        window.location.origin + $(".header-title .topic-link").attr("href");

      var newBookmark = {
        url: bookmarkDataurl,
        title: bookmarkDatatitle,
        cate: bookmarkDatacate,
        tags: bookmarkDatatags,
        timestamp: new Date().getTime(),
        sort: 999, // 默认排序值
      };

      const browserAPI = typeof browser !== "undefined" ? browser : chrome;

      // 获取当前书签列表
      browserAPI.storage.local.get(["bookmarks"], (result) => {
        let bookmarks = result.bookmarks || [];

        // 检查是否已经收藏过相同 URL 的内容
        const existingIndex = bookmarks.findIndex((item) => item.url === newBookmark.url);

        if (existingIndex !== -1) {
          // 如果已存在，更新收藏
          bookmarks[existingIndex] = newBookmark;
          this.messageToast(
            "已更新收藏" + (this.silentBookmark ? "" : "，请前往收藏夹查看。")
          );
        } else {
          // 新增收藏
          bookmarks.push(newBookmark);
          this.messageToast(
            "收藏成功" + (this.silentBookmark ? "" : "，请前往收藏夹查看。")
          );
        }

        // 保存更新后的书签列表
        browserAPI.storage.local.set({
          bookmarks: bookmarks,
          bookmarkData: newBookmark, // 保持向后兼容
        });
      });

      // 只有在非无感收藏模式下才跳转到收藏页面
      if (!this.silentBookmark) {
        // 发送消息到后台脚本
        browserAPI.runtime.sendMessage({ action: "open_bookmark_page" });
      }
    },
  },
  created() {
    // 获取无感收藏设置
    const silentBookmarkSetting = localStorage.getItem("linuxdoSilentBookmark");
    if (silentBookmarkSetting !== null) {
      this.silentBookmark = silentBookmarkSetting === "true";
    }

    if (this.modelValue) {
      this.bookmark();
    }
  },
  beforeUnmount() {
    // 清除定时器
    if (this.bookmarkIntervalId) {
      clearInterval(this.bookmarkIntervalId);
    }
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    if (this.bookmarkIntervalId) {
      clearInterval(this.bookmarkIntervalId);
    }
  },
};
</script>
