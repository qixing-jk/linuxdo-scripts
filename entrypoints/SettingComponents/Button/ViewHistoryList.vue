<template>
  <div>
    <div
      class="el-button"
      :class="{ act: status }"
      @click="viewhistory"
      title="查看历史已读列表"
    >
      已读
    </div>
    <div id="viewhistorylist" v-show="status">
      <div>
        <span class="inner-title">历史已读（20 条）</span>
        <button @click="Refreshdata">刷新</button>
      </div>
      <ul v-if="first20Topics.length > 0">
        <li v-for="item in first20Topics" :key="item.id">
          <a :href="`${this.url}/t/topic/` + item.id" target="_blank">
            {{ item.title }}
          </a>
        </li>
      </ul>
      <ul v-else>
        <li>正在获取中，请稍后...</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: window.location.origin,
      status: false,
      first20Topics: [],
    };
  },
  methods: {
    // 点击按钮查看历史已读弹窗
    viewhistory() {
      this.status = !this.status;
      if (this.first20Topics.length < 1) {
        this.getFirst20Topics();
      }
    },

    // 获取历史已读记录数据
    getFirst20Topics() {
      const url = window.location.origin;
      fetch(`${url}/read.json`)
        .then((response) => response.json())
        .then((data) => {
          this.first20Topics = data.topic_list.topics.slice(0, 20);
        });
    },

    // 手动刷新数据
    Refreshdata() {
      this.first20Topics = [];
      this.getFirst20Topics();
    },
  },
};
</script>

<style lang="less" scoped>
#viewhistorylist {
  line-height: 1.6;
  position: fixed;
  bottom: 20px;
  right: 90px;
  width: 450px;
  background-color: var(--secondary);
  padding: 20px 5px 20px 20px;
  z-index: 10000;
  font-size: 14px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-out;
  border: 1px solid var(--primary-low);
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  strong {
    color: var(--primary);
    font-weight: 600;
  }

  .inner-title {
    font-size: 16px;
    font-weight: 600;
    margin-right: 10px;
  }

  ul {
    max-height: 400px;
    overflow-y: auto;
    padding: 0;
    list-style: none;
    padding-right: 10px;

    li {
      padding: 5px 0;
      border-bottom: 1px solid #eee;
      margin-bottom: 5px;

      a {
        color: var(--primary);
        text-decoration: none;
        display: block;
        padding: 2px 0;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
