<template>
  <input
    type="file"
    id="fileInput"
    ref="fileInput"
    style="display: none"
    accept=".json"
    @change="handleFileUpload"
  />
  <button class="btn import" @click="triggerFileInput" :disabled="importing">
    {{ importing ? '导入中...' : '导入' }}
  </button>
  <button class="btn export" @click="exportData" :disabled="exporting">
    {{ exporting ? '导出中...' : '导出' }}
  </button>
</template>

<script>
import settingsManager from '../../utilities/settingsManager.js';

export default {
  data() {
    return {
      importing: false,
      exporting: false
    };
  },
  methods: {
    // 提示组件
    messageToast(message, type = 'info') {
      const messageElement = document.createElement("div");
      messageElement.className = `messageToast-text ${type}`;
      messageElement.innerText = message;
      document.getElementById("messageToast").appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    // 导入数据
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type !== "application/json") {
        this.messageToast("请选择有效的 JSON 文件", "error");
        return;
      }

      this.importing = true;
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          await this.importData(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          this.messageToast("JSON 文件格式错误", "error");
        } finally {
          this.importing = false;
          // 清空文件输入，允许重复选择同一文件
          event.target.value = '';
        }
      };

      reader.onerror = () => {
        this.messageToast("文件读取失败", "error");
        this.importing = false;
        event.target.value = '';
      };

      reader.readAsText(file);
    },
    // 处理导入的数据
    async importData(data) {
      try {
        // 验证数据结构
        if (!data || typeof data !== 'object') {
          throw new Error('无效的数据格式');
        }

        // 保存到 IndexedDB
        const success = await settingsManager.saveSettings(data);
        
        if (success) {
          this.messageToast("导入成功，即将刷新页面！", "success");
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          throw new Error('保存到数据库失败');
        }
      } catch (error) {
        console.error("导入数据失败：", error);
        this.messageToast(`导入失败：${error.message}`, "error");
      }
    },
    // 导出数据
    async exportData() {
      try {
        this.exporting = true;
        
        // 从 IndexedDB 获取所有设置数据
        const data = await settingsManager.getSettings();
        
        if (!data) {
          this.messageToast("没有找到可导出的数据", "warning");
          return;
        }

        // 生成文件名
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedDate = year + month + day;

        // 创建并下载文件
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `linuxdo-script-data-${formattedDate}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.messageToast("导出成功！", "success");
      } catch (error) {
        console.error("导出数据失败：", error);
        this.messageToast(`导出失败：${error.message}`, "error");
      } finally {
        this.exporting = false;
      }
    },
  },
};
</script>
