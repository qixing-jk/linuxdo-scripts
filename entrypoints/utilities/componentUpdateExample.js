// 組件更新示例 - 如何將現有組件遷移到 IndexedDB 存儲

// 舊的方式（使用 localStorage）
const oldWay = {
  // 讀取設置
  getSettings() {
    let settingData = localStorage.getItem("linuxdoscriptssettingDMI");
    return settingData ? JSON.parse(settingData) : null;
  },
  
  // 保存設置
  saveSettings(data) {
    localStorage.setItem("linuxdoscriptssettingDMI", JSON.stringify(data));
  },
  
  // 更新特定設置
  updateSetting(key, value) {
    let settingData = this.getSettings() || {};
    settingData[key] = value;
    this.saveSettings(settingData);
  }
};

// 新的方式（使用 IndexedDB + 兼容層）
import storageCompat, { waitForSettings, getSafeSettings } from './storageCompat.js';

const newWay = {
  // 異步讀取設置（推薦）
  async getSettings() {
    return await storageCompat.getItem("linuxdoscriptssettingDMI");
  },
  
  // 同步讀取設置（兼容現有代碼）
  getSettingsSync() {
    return getSafeSettings();
  },
  
  // 異步保存設置（推薦）
  async saveSettings(data) {
    return await storageCompat.setItem("linuxdoscriptssettingDMI", JSON.stringify(data));
  },
  
  // 同步保存設置（兼容現有代碼，但不推薦）
  saveSettingsSync(data) {
    storageCompat.setItemSync("linuxdoscriptssettingDMI", JSON.stringify(data));
  },
  
  // 異步更新特定設置
  async updateSetting(key, value) {
    const settingData = await this.getSettings();
    const parsedData = settingData ? JSON.parse(settingData) : {};
    parsedData[key] = value;
    return await this.saveSettings(parsedData);
  }
};

// Vue 組件中的使用示例
const vueComponentExample = {
  // 在組件的 methods 中
  methods: {
    // 方法 1：完全異步（推薦）
    async fastOpen() {
      try {
        const settingDataStr = await storageCompat.getItem("linuxdoscriptssettingDMI");
        let settingData = settingDataStr ? JSON.parse(settingDataStr) : {};
        settingData.isUserTags = true;
        await storageCompat.setItem("linuxdoscriptssettingDMI", JSON.stringify(settingData));
        this.open = true;
      } catch (error) {
        console.error('快速開啟失敗：', error);
      }
    },
    
    // 方法 2：混合方式（兼容現有代碼）
    fastOpenCompat() {
      // 先嘗試從緩存獲取
      let settingData = getSafeSettings() || {};
      settingData.isUserTags = true;
      
      // 異步保存（不等待結果）
      storageCompat.setItem("linuxdoscriptssettingDMI", JSON.stringify(settingData))
        .catch(error => console.error('保存設置失敗：', error));
      
      this.open = true;
    },
    
    // 方法 3：等待數據加載完成後再操作
    async ensureDataLoaded() {
      await waitForSettings();
      // 現在可以安全地使用同步方法
      const settings = getSafeSettings();
      return settings;
    }
  },
  
  // 在組件的 created/mounted 中
  async created() {
    try {
      // 等待設置數據加載
      await waitForSettings();
      
      // 現在可以安全地獲取設置
      const settings = getSafeSettings();
      if (settings) {
        this.open = settings.isUserTags;
        this.tableData = settings.usertags || [];
      }
    } catch (error) {
      console.error('加載組件數據失敗：', error);
      // 使用默認值
      this.open = false;
      this.tableData = [];
    }
  }
};

// 漸進式遷移策略
const migrationStrategy = {
  // 階段 1：添加異步方法，保留同步方法
  phase1: {
    // 新增異步方法
    async getSettingsAsync() {
      return await storageCompat.getItem("linuxdoscriptssettingDMI");
    },
    
    // 保留原有同步方法，但添加警告
    getSettings() {
      console.warn('建議使用 getSettingsAsync() 方法');
      return getSafeSettings();
    }
  },
  
  // 階段 2：逐步替換調用點
  phase2: {
    // 在關鍵路徑使用異步方法
    async criticalOperation() {
      const settings = await this.getSettingsAsync();
      // 處理關鍵操作
    },
    
    // 在非關鍵路徑仍可使用同步方法
    nonCriticalOperation() {
      const settings = this.getSettings();
      // 處理非關鍵操作
    }
  },
  
  // 階段 3：完全遷移到異步
  phase3: {
    // 所有操作都使用異步方法
    async allOperations() {
      const settings = await storageCompat.getItem("linuxdoscriptssettingDMI");
      // 所有操作
    }
  }
};

export { 
  oldWay, 
  newWay, 
  vueComponentExample, 
  migrationStrategy 
};
