<template>
  <div>
    <!-- 加载中状态 -->
    <div v-if="loading" class="menu-about">
      <p class="hint">加载中...</p>
    </div>
    <!-- 加载完成后显示 -->
    <template v-else>
      <div class="menu-about" v-show="!open">
        <p class="hint">请注意，用户标签功能已关闭，请在通用设置中开启！</p>
        <p class="hint">
          也可以
          <span class="initialization" @click="fastOpen()"> 快速开启</span>
        </p>
        <p class="hint" v-show="tableData && tableData.length > 0">
          下列用户标签不会生效！
        </p>
      </div>
      <table class="menu-table">
        <thead>
          <tr>
            <th>用户名</th>
            <th>标签</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="item.name">
            <td>{{ item.name }}</td>
            <td>
              {{ item.tags }}
            </td>
            <td>
              <span class="span" @click="editTags(item)">修改</span>
              <span class="span" @click="delTags(item, index)" style="color: #e00"
                >删除！</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
import $ from "jquery";
import storageCompat, { waitForSettings } from "../../utilities/storageCompat.js";
import settingsManager from "../../utilities/settingsManager.js";
export default {
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      tableData: this.value,
      open: false,
      loading: true, // 添加加载状态
      userTagsIntervalId: null, // 添加变量存储定时器 ID
    };
  },
  watch: {
    value(newValue) {
      this.tableData = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("update:value", this.tableData);
    },
    // 修改标签
    async editTags(item) {
      var tags = prompt(`对 @${item.name} 修改标签`, item.tags);
      if (tags == null) {
        return item.tags;
      }
      if (tags != item.tags) {
        var existingPerson = this.tableData.find((items) => items.name === item.name);

        if (existingPerson) {
          // 如果存在，直接修改该对象的 tags 属性
          existingPerson.tags = tags;
        } else {
          // 如果不存在，新增对象
          this.tableData.push({ name: item.name, tags: tags });
        }
        
        try {
          await settingsManager.updateSettings({ usertags: this.tableData });
          this.$emit("update:value", this.tableData);
        } catch (error) {
          console.error('更新用戶標籤失敗：', error);
          // 如果更新失敗，恢復原來的數據
          if (existingPerson) {
            existingPerson.tags = item.tags;
          } else {
            this.tableData.pop();
          }
        }
      }
    },
    async delTags(item, index) {
      var del = confirm(`是否确认删除${item.name}(${item.tags})！`);
      if (del == true) {
        const deletedItem = this.tableData.splice(index, 1)[0];

        try {
          await settingsManager.updateSettings({ usertags: this.tableData });
          this.$emit("update:value", this.tableData);
        } catch (error) {
          console.error('刪除用戶標籤失敗：', error);
          // 如果刪除失敗，恢復數據
          this.tableData.splice(index, 0, deletedItem);
        }
      }
    },
    // 快速开启
    async fastOpen() {
      try {
        await settingsManager.updateSettings({ isUserTags: true });
        
        // 创建一个消息提示元素
        const messageElement = document.createElement("div");
        messageElement.className = "messageToast-text";
        messageElement.innerText = "开启用户标签功能成功，即将自动刷新！";
        document.getElementById("messageToast").appendChild(messageElement);
        setTimeout(() => {
          messageElement.remove();
          location.reload();
        }, 1000);
      } catch (error) {
        console.error('開啟用戶標籤功能失敗：', error);
        // 创建错误提示元素
        const messageElement = document.createElement("div");
        messageElement.className = "messageToast-text";
        messageElement.innerText = "开启用户标签功能失败，请重试！";
        messageElement.style.backgroundColor = "#f44336";
        document.getElementById("messageToast").appendChild(messageElement);
        setTimeout(() => {
          messageElement.remove();
        }, 3000);
      }
    },
  },
  async created() {
    
    try {
      // 等待設置數據加載完成，直接使用返回值
      let settingData = await waitForSettings();
      
      if (!settingData) {
        settingData = { usertags: [], isUserTags: false };
      }
      
      // 确保 usertags 是数组
      const usertags = Array.isArray(settingData.usertags) ? settingData.usertags : [];
      this.tableData = usertags.filter((user) => user && user.tags);
      
      // 设置 open 状态
      this.open = settingData.isUserTags === true || settingData.isUserTags === 'true';
      
      // 关闭 loading
      this.loading = false;
      
    } catch (error) {
      console.error('created error:', error);
      this.loading = false; // 出错也要关闭 loading
    }
    
    // setInterval 逻辑移到 mounted 中
  },
  mounted() {
    const self = this;
    
    this.userTagsIntervalId = setInterval(() => {
      // 使用 this.open 而不是局部变量，因为 mounted 可能在 created 异步完成前执行
      if (!self.open) {
        return;
      }

      if ($(".addusertag").length < 1) {
        const controls = $(".usercard-controls");
        if (controls.length > 0) {
          controls.append(
            `<li><button class="btn addusertag" type="button">添加用户标签</button></li>`
          );

          $(".addusertag").click(async function () {
            var person = $(".user-card .user-profile-link").attr("href").replace("/u/", "");
            var tags = prompt(`对 @${person} 设置标签（保存后刷新页面）`, "");
            if (tags == null) {
              return false;
            }

            var existingPerson = self.tableData.find(
              (item) => item.name === person
            );

            if (existingPerson) {
              existingPerson.tags = tags;
            } else {
              self.tableData.push({ name: person, tags: tags });
            }

            try {
              await settingsManager.updateSettings({ usertags: self.tableData });
            } catch (error) {
              console.error('添加用户标签失败:', error);
              alert('保存失败，请重试！');
            }
          });
        }
      }

      $(".topic-meta-data").each(function () {
        const usernameEl = $(this).find(".first a");
        if (usernameEl.length === 0) return;
        
        const username = usernameEl.attr("data-user-card");
        if (!username) return;
        
        const userTag = self.tableData.find((user) => user.name === username.toLowerCase());
        if (userTag) {
          if ($(this).find(".linuxdoscripts-tag").length < 1) {
            $(this).find(".names").append(`<span class="linuxdoscripts-tag"># ${userTag.tags}</span>`);
          }
        }
      });
    }, 1000);
  },
  beforeUnmount() {
    // 清除定时器
    if (this.userTagsIntervalId) {
      clearInterval(this.userTagsIntervalId);
    }
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    if (this.userTagsIntervalId) {
      clearInterval(this.userTagsIntervalId);
    }
  },
};
</script>
