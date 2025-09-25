<template>
  <div>
    <div class="el-button" @click="togglePopupSize" title="等级查询">
      <span>等级</span>
    </div>
    <div v-if="!isMinimized" id="linuxDoLevelPopupContent">
      <div v-html="content"></div>
      <input
        v-model="username"
        autocomplete="off"
        type="text"
        placeholder="请输入用户名..."
        id="linuxDoUserSearch"
      />

      <!-- 按钮组 -->
      <div class="button-group">
        <button @click="handleSearch" class="btn btn-primary" type="button">
          <span class="d-button-label">查询等级（不限）</span>
        </button>
        <button @click="fetchConnectData" class="btn btn-connect" type="button">
          <span class="d-button-label">Connect 数据（本人）</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import {
  fetchConnectData,
  getConnectHome,
  testConnectConnection,
} from "../../utilities/connectApi.js";

export default {
  data() {
    return {
      url: window.location.origin,
      isMinimized: true,
      content: "输入用户名查询等级信息",
      username: "",
      levelDescriptions: {
        0: "游客",
        1: "基本用户",
        2: "成员",
        3: "活跃用户",
        4: "领导者",
      },
      levelRequirements: {
        0: { topics_entered: 5, posts_read_count: 30, time_read: 600 },
        1: {
          days_visited: 15,
          likes_given: 1,
          likes_received: 1,
          post_count: 3,
          topics_entered: 20,
          posts_read_count: 100,
          time_read: 3600,
        },
        2: {
          days_visited: 50,
          likes_given: 30,
          likes_received: 20,
          post_count: 10,
          topics_entered: 0,
          posts_read_count: 0,
        },
      },
      usernameTimer: null,
      // Connect API 相关数据
      connectTableData: null,
    };
  },
  methods: {
    // 获取 Connect API 数据并提取 table 标签
    async fetchConnectData() {
      try {
        this.content = "正在获取 Connect 数据，请勿进行其他操作...";

        const response = await fetchConnectData("/");

        if (response.success) {
          // 从返回的 HTML 中提取 table 标签和第二个 p 标签
          const extractedData = this.extractTableFromHtml(response.data);

          if (extractedData && extractedData.table) {
            this.connectTableData = extractedData;

            // 构建显示内容
            let displayContent = "";

            displayContent += `<div>
              ${extractedData.table.html}
            </div>`;

            if (extractedData.secondP && extractedData.secondP.content) {
              displayContent += `<div>
                <span class="text-green-500">${extractedData.secondP.content}</span>
              </div>`;
            }

            this.content = displayContent;
            console.log("Connect 提取的数据：", extractedData);
          } else {
            // Connect 中不存在 table 标签，给出提示并调用默认查询
            this.content =
              "<strong style='color: orange;'>Connect 数据中未找到表格信息，正在切换到常规查询模式...</strong>";
            setTimeout(() => {
              this.handleSearch();
            }, 1000); // 1.5 秒后自动切换到常规查询
          }
        } else {
          // Connect API 请求失败，给出提示并调用默认查询
          this.content =
            "<strong style='color: red;'>Connect API 请求失败，正在切换到常规查询模式...</strong>";
          setTimeout(() => {
            this.handleSearch();
          }, 1000);
        }
      } catch (error) {
        // 发生异常，给出提示并调用默认查询
        console.error("Connect API 请求异常：", error);
        this.content =
          "<strong style='color: red;'>Connect API 请求异常，正在切换到常规查询模式...</strong>";
        setTimeout(() => {
          this.handleSearch();
        }, 1000);
      }
    },

    // 从 HTML 字符串中提取 table 标签及其后面第二个 p 标签的内容
    extractTableFromHtml(htmlString) {
      try {
        // 创建一个临时的 DOM 解析器
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        // 查找所有 table 标签
        const tables = doc.querySelectorAll("table");

        if (tables.length > 0) {
          // 取第一个 table 标签
          const firstTable = tables[0];
          const rows = firstTable.querySelectorAll("tr");

          // 查找 table 后面的 p 标签
          let secondPTag = null;
          let secondPContent = null;

          // 获取 table 后面的所有兄弟元素
          let currentElement = firstTable.nextElementSibling;
          let pTagCount = 0;

          while (currentElement && pTagCount < 2) {
            if (currentElement.tagName && currentElement.tagName.toLowerCase() === "p") {
              pTagCount++;
              if (pTagCount === 2) {
                secondPTag = currentElement;
                secondPContent =
                  currentElement.textContent || currentElement.innerText || "";
                break;
              }
            }
            currentElement = currentElement.nextElementSibling;
          }

          return {
            table: {
              html: firstTable.outerHTML,
              rows: rows.length,
              element: firstTable,
            },
            secondP: {
              html: secondPTag ? secondPTag.outerHTML : null,
              content: secondPContent,
              element: secondPTag,
            },
            allTables: Array.from(tables).map((table) => ({
              html: table.outerHTML,
              rows: table.querySelectorAll("tr").length,
            })),
          };
        }

        return null;
      } catch (error) {
        console.error("解析 HTML 时出错：", error);
        return null;
      }
    },
    async fetchAboutData() {
      try {
        const response = await fetch(`${this.url}/about.json`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
          method: "GET",
        });
        if (!response.ok) throw new Error(`HTTP 错误！状态：${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("获取关于页面数据失败：", error);
        this.displayError("获取关于页面数据失败");
        return null;
      }
    },
    async fetchUserData(username) {
      try {
        const response = await fetch(`${this.url}/u/${username}/summary.json`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
          method: "GET",
        });
        if (!response.ok) throw new Error(`HTTP 错误！状态：${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("获取用户数据失败：", error);
        this.displayError("获取用户数据失败");
        return null;
      }
    },
    async handleSearch() {
      if (this.username == "") {
        return false;
      }
      this.content = "正在查询中，请勿进行其他操作...";
      const username = this.username.trim();
      if (username) {
        const aboutData = await this.fetchAboutData();
        const userData = await this.fetchUserData(username);
        if (userData && aboutData) {
          const userSummary = userData.user_summary;
          const user = userData.users[0];
          const status = aboutData.about.stats;
          this.updatePopupContent(userSummary, user, status);
        }
      }
    },
    updatePopupContent(userSummary, user, status) {
      if (userSummary && user) {
        let content = `<strong>信任等级：</strong>${
          this.levelDescriptions[user.trust_level]
        }<br><strong>升级进度：</strong><br>`;

        if (user.trust_level === 3) {
          content += `联系管理员以升级到领导者<br>`;
        } else if (user.trust_level === 4) {
          content += `您已是最高信任等级<br>`;
        } else {
          const requirements = this.levelRequirements[user.trust_level];
          if (user.trust_level === 2) {
            requirements.posts_read_count = Math.min(
              Math.floor(status.posts_30_days / 4),
              20000
            );
            requirements.topics_entered = Math.min(
              Math.floor(status.topics_30_days / 4),
              500
            );
          }

          Object.entries(requirements).forEach(([key, val]) => {
            const currentVal = userSummary[key] || 0;
            const color = currentVal >= val ? "green" : "red";
            content += `${this.translateStat(
              key
            )}: <span style="color: ${color};">${currentVal} / ${val}</span><br>`;
          });
        }

        this.content = content;
      }
    },
    togglePopupSize() {
      this.isMinimized = !this.isMinimized;
    },
    displayError(message) {
      this.content = `<strong>错误：</strong>${message}`;
    },
    translateStat(stat) {
      const translations = {
        days_visited: "访问天数",
        likes_given: "给出的赞",
        likes_received: "收到的赞",
        post_count: "帖子数量",
        posts_read_count: "阅读的帖子数",
        topics_entered: "进入的主题数",
        time_read: "阅读时间",
      };

      return translations[stat] || stat;
    },
    clearTimer() {
      if (this.usernameTimer) {
        clearInterval(this.usernameTimer);
        this.usernameTimer = null;
      }
    },
  },
  created() {
    this.usernameTimer = setInterval(() => {
      if (!this.username) {
        const avatarImg = $("#toggle-current-user img.avatar");
        const src = avatarImg.length ? avatarImg.attr("src") : null;
        if (src) {
          if (window.location.hostname === "linux.do") {
            const match = src.match(/\/user_avatar\/linux\.do\/([^\/]+)/);
            if (match && match[1]) {
              this.username = match[1];
            }
          } else if (window.location.hostname === "idcflare.com") {
            const match = src.match(/\/user_avatar\/idcflare\.com\/([^\/]+)/);
            if (match && match[1]) {
              this.username = match[1];
            }
          }
        }
      }
    }, 1000);
  },
  beforeUnmount() {
    this.clearTimer();
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>

<style scoped lang="less">
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
  }
}

.minimized {
  width: 50px !important;
  height: 50px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  overflow: hidden;
  cursor: pointer;
  animation: pulse 2s infinite;
}

#linuxDoLevelPopupContent {
  line-height: 1.6;
  position: fixed;
  bottom: 20px;
  right: 90px;
  width: 450px;
  background-color: var(--secondary);
  padding: 20px;
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
}

#linuxDoUserSearch {
  width: 100%;
  margin-top: 15px;
  padding: 10px 12px;
  border: 2px solid var(--primary-low);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }
}

// 按钮组样式
.button-group {
  display: flex;
  gap: 8px;
  margin-top: 10px;

  .btn {
    flex: 1;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    .d-button-label {
      position: relative;
      z-index: 1;
    }

    &.btn-primary {
      color: #fff;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-medium) 100%);
      box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.2);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
      }
    }

    &.btn-connect {
      color: #fff;
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      box-shadow: 0 2px 8px rgba(23, 162, 184, 0.2);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.minimize-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10001;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  text-align: center;
  line-height: 32px;
  width: 32px;
  height: 32px;
  color: var(--primary);
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-low);
  }
}
</style>
