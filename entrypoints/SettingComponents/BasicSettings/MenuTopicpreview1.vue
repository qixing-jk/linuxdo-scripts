<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启话题预览功能</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
import $ from "jquery";
import { isMutedPostPage } from "../../utilities/post";
import { getSafeSettings } from "../../utilities/storageCompat.js";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      lightboxTimer: null,
      mainTimer: null,
      pollingTimer: null,

      isLeft: false, // 是否在最左侧
    };
  },
  methods: {
    init() {
      let that = this;
      if ($(".topicpreview").length < 1) {
        $("body").append(`<div class="topicpreview">
          <div class="topicpreview-opacity"></div>
          <div class="topicpreview-container">
            <p style="text-align: center">正在加载中...</p>  
          </div>
          </div>`);
      }

      $(".topic-list .main-link a.title").each(function () {
        const id = $(this).attr("data-topic-id");
        if ($(this).parents(".link-top-line").find(".topicpreview-btn").length < 1) {
          if(that.isLeft) {
            $(this)
              .parents(".link-top-line")
              .prepend(
                `<button class="btn btn-default topicpreview-btn opacity1" data-id="${id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scan-search-icon lucide-scan-search"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/></svg></button>`
              );
          }
          else {
            $(this)
              .parents(".link-top-line")
              .append(
                `<button class="btn btn-icon-text btn-default topicpreview-btn" data-id="${id}">预览</button>`
              );
          }
        }
      });
    },
    setClick() {
      const self = this;
      $(".topicpreview-btn").each(function () {
        $(this).click(function () {
          $(".topicpreview").show();
          let previewData = {};
          let previewurl = $(this).attr("data-id");

          fetch(`https://linux.do/t/${previewurl}.json`)
            .then((response) => response.json())
            .then((data) => {
              previewData = data;

              // 定义一个转化的时间的方法
              function formatDate(isoString) {
                const date = new Date(isoString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以要加 1
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                const seconds = String(date.getSeconds()).padStart(2, "0");
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              }

              $(".topicpreview-container").html(`
                <div class="topicpreview-title">${previewData.title}</div>
                <p class="topicpreview-date">发帖时间：${formatDate(
                  previewData.created_at
                )}</p>
                <div class="topicpreview-content"></div>
                <p style="text-align: center;">仅显示前 20 条，<a class="preview-link" href="https://linux.do/t/topic/${previewurl}/">查看更多</a></p>
              `);

              $.each(previewData.post_stream.posts, function (index, post) {
                $(".topicpreview .topicpreview-content").append(`
                  <div class="item">
                    <span class="itemfloor">${index + 1}楼</span>
                    <div class="itempost">
                      <div class="itemname">
                        ${post.display_username} 
                        <span>${post.username}</span>
                        <div class="itemdate">${formatDate(post.created_at)}</div>
                      </div>
                      ${post.cooked}
                    </div>
                  </div>
                `);
              });

              // 清除之前的定时器
              if (self.lightboxTimer) {
                clearInterval(self.lightboxTimer);
              }
              
              // 创建新定时器并保存引用
              self.lightboxTimer = setInterval(() => {
                $(".lightbox").attr("href", "javascript:void(0)");
              }, 1000);
            });
        });
      });

      // 关闭弹窗
      $(".topicpreview-opacity").click(this.closePreview);
    },
    closePreview() {
      $(".topicpreview").hide();
      $(".topicpreview-container").html(
        `<p style="text-align: center">正在加载中...</p> `
      );
    },
    handleKeyDown(event) {
      if (event.key === "Escape") {
        this.closePreview();
      }
    },
    clearAllTimers() {
      if (this.lightboxTimer) {
        clearInterval(this.lightboxTimer);
        this.lightboxTimer = null;
      }
      if (this.mainTimer) {
        clearInterval(this.mainTimer);
        this.mainTimer = null;
      }
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
    }
  },
  async created() {
    if (this.modelValue) {
      // 打印一下 indexdb 中，linuxdoscriptssettingDMI 的 checked7_2 值
      // 使用新的 IndexedDB 存储系統
      const settingsData = getSafeSettings();
      
      // 打印 checked7_2 的值
      this.isLeft = settingsData?.checked7_2;
      
      this.mainTimer = setInterval(() => {
        if (!isMutedPostPage()) {
          this.init();
        }

        $(".preview-link").attr("target", "_blank");
      }, 1000);

      let pollinglength1 = 0;
      let pollinglength2 = 0;
      this.pollingTimer = setInterval(() => {
        if (pollinglength1 != $(".topic-list-body tr").length) {
          pollinglength1 = $(".topic-list-body tr").length;
          this.setClick();
        }
        if (pollinglength2 != $(".post-stream .topic-post").length) {
          pollinglength2 = $(".post-stream .topic-post").length;
          this.setClick();
        }
      }, 1000);
      document.addEventListener("keydown", this.handleKeyDown);
    }
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.clearAllTimers();
  },
  beforeDestroy() {
    this.clearAllTimers();
  },
};
</script>
