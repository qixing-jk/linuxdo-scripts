// 全局設置管理器
import dbStorage from './indexedDBStorage.js';
import StorageDebugger from './storageDebugger.js';

class SettingsManager {
  constructor() {
    this.cache = null;
    this.isLoading = false;
    this.loadPromise = null;
  }

  // 獲取設置數據（帶緩存）
  async getSettings() {
    if (this.cache) {
      return this.cache;
    }

    if (this.isLoading) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this._loadSettings();
    
    try {
      this.cache = await this.loadPromise;
      return this.cache;
    } finally {
      this.isLoading = false;
      this.loadPromise = null;
    }
  }

  // 私有方法：加載設置
  async _loadSettings() {
    try {
      return await dbStorage.getSettingsWithMigration();
    } catch (error) {
      console.error('加載設置失敗：', error);
      return null;
    }
  }

  // 保存設置數據
  async saveSettings(settingsData) {
    try {
      // 在開發環境中進行調試檢查
      if (process.env.NODE_ENV === 'development') {
        const debugResult = StorageDebugger.canBeStored(settingsData);
        if (!debugResult.canStore) {
          console.warn('設置數據包含不可存儲的屬性：', debugResult.issues);
        }
      }
      
      await dbStorage.saveSettings(settingsData);
      this.cache = settingsData; // 更新緩存
      return true;
    } catch (error) {
      console.error('保存設置失敗：', error);
      
      // 如果是 DataCloneError，嘗試生成調試報告
      if (error.name === 'DataCloneError') {
        console.group('🔍 DataCloneError 調試信息');
        StorageDebugger.generateReport(settingsData, 'settingsData');
        
        // 嘗試自動修復
        const fixResult = StorageDebugger.attemptFix(settingsData);
        if (fixResult.success) {
          console.log('🔧 嘗試使用修復後的數據重新保存...');
          try {
            await dbStorage.saveSettings(fixResult.data);
            this.cache = fixResult.data;
            console.log('✅ 使用修復後的數據保存成功');
            console.groupEnd();
            return true;
          } catch (retryError) {
            console.error('❌ 修復後仍然失敗：', retryError);
          }
        }
        console.groupEnd();
      }
      
      return false;
    }
  }

  // 更新部分設置
  async updateSettings(partialSettings) {
    try {
      const currentSettings = await this.getSettings() || {};
      const updatedSettings = this.deepMerge(currentSettings, partialSettings);
      return await this.saveSettings(updatedSettings);
    } catch (error) {
      console.error('更新設置失敗：', error);
      return false;
    }
  }

  // 獲取特定設置項
  async getSetting(key, defaultValue = null) {
    try {
      const settings = await this.getSettings();
      return settings && settings[key] !== undefined ? settings[key] : defaultValue;
    } catch (error) {
      console.error('獲取設置項失敗：', error);
      return defaultValue;
    }
  }

  // 設置特定設置項
  async setSetting(key, value) {
    try {
      return await this.updateSettings({ [key]: value });
    } catch (error) {
      console.error('設置設置項失敗：', error);
      return false;
    }
  }

  // 清除緩存
  clearCache() {
    this.cache = null;
  }

  // 刪除所有設置
  async clearSettings() {
    try {
      await dbStorage.removeSettings();
      this.cache = null;
      return true;
    } catch (error) {
      console.error('清除設置失敗：', error);
      return false;
    }
  }

  // 深度合併對象
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] instanceof Object && !Array.isArray(source[key]) && key in result) {
        result[key] = this.deepMerge(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  // 兼容性方法：模擬 localStorage 接口
  async getItem(key) {
    if (key === 'linuxdoscriptssettingDMI') {
      const settings = await this.getSettings();
      return settings ? JSON.stringify(settings) : null;
    }
    // 對於其他 key，回退到 localStorage
    return localStorage.getItem(key);
  }

  async setItem(key, value) {
    if (key === 'linuxdoscriptssettingDMI') {
      try {
        const settings = JSON.parse(value);
        return await this.saveSettings(settings);
      } catch (error) {
        console.error('設置數據格式錯誤：', error);
        return false;
      }
    }
    // 對於其他 key，回退到 localStorage
    localStorage.setItem(key, value);
    return true;
  }

  async removeItem(key) {
    if (key === 'linuxdoscriptssettingDMI') {
      return await this.clearSettings();
    }
    // 對於其他 key，回退到 localStorage
    localStorage.removeItem(key);
    return true;
  }
}

// 創建全局實例
const settingsManager = new SettingsManager();

// 為了向後兼容，提供一個 localStorage 風格的 API
const compatStorage = {
  async getItem(key) {
    return await settingsManager.getItem(key);
  },
  
  async setItem(key, value) {
    return await settingsManager.setItem(key, value);
  },
  
  async removeItem(key) {
    return await settingsManager.removeItem(key);
  }
};

export default settingsManager;
export { compatStorage };
