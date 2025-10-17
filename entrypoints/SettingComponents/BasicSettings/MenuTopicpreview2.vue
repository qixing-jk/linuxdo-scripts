<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启话题模态预览功能 (与 2 互斥)</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
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
      $("head").append(`<style>
.model-overlay{display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;overflow:hidden;cursor:pointer}
.model-opacity{position:absolute;top:0;left:0;width:100%;height:100%;opacity:1;background:rgba(0, 0, 0, 0.6);z-index:9;}
.model-content{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:0;border-radius:12px;width:90%;max-width:1400px;height:90%;z-index:10000;display:flex;flex-direction:column;box-shadow:0 5px 15px rgba(0,0,0,.3);overflow:hidden;cursor:default}
.model-body{flex:1;width:100%;height:100%;position:relative;overflow:hidden}
.model-iframe{width:100%;height:100%;border:none}
body.model-open{overflow:hidden!important;padding-right:17px}
html.model-open-html{overflow:hidden!important}
      </style>`);

      let that = this;
      if ($(".model-overlay").length < 1) {
        $("body").append(` <div class="model-overlay">
          <div class="model-opacity"></div>
          <div class="model-content">
            <div class="model-body">
              <iframe class="model-iframe" frameborder="0"></iframe>
            </div>
          </div>
        </div>`);
      }

      $(".topic-list .main-link a.title").each(function () {
        const id = $(this).attr("data-topic-id");
        if ($(this).parents(".link-top-line").find(".topicpreview-btn").length < 1) {
          if (that.isLeft) {
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
      $(".topicpreview-btn").each(function () {
        $(this).click(function () {
          $(".model-overlay").show();
          console.log($(this).attr("data-id"))
          $(".model-iframe").attr("src", `https://linux.do/t/topic/${$(this).attr("data-id")}`);
        });
      });

      // 关闭弹窗
      $(".model-opacity").click(this.closePreview);
    },
    closePreview() {
      $(".model-overlay").hide();
      $(".model-iframe").attr("src", "");
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
