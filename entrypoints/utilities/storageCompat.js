// 存儲兼容性層 - 讓其他組件無縫使用 IndexedDB
import settingsManager from './settingsManager.js';

// 創建一個全局的 localStorage 兼容對象
const storageCompat = {
  // 異步版本的 localStorage 方法
  async getItem(key) {
    return await settingsManager.getItem(key);
  },
  
  async setItem(key, value) {
    return await settingsManager.setItem(key, value);
  },
  
  async removeItem(key) {
    return await settingsManager.removeItem(key);
  },

  // 同步版本（為了兼容現有代碼）
  getItemSync(key) {
    if (key === 'linuxdoscriptssettingDMI') {
      console.warn('使用同步方法獲取設置數據可能導致性能問題，建議使用異步版本');
      // 返回一個 Promise，但立即 resolve 緩存的數據
      const cached = settingsManager.cache;
      return cached ? JSON.stringify(cached) : null;
    }
    return localStorage.getItem(key);
  },

  setItemSync(key, value) {
    if (key === 'linuxdoscriptssettingDMI') {
      console.warn('使用同步方法設置數據可能導致數據丟失，建議使用異步版本');
      // 異步保存，但不等待結果
      try {
        const settings = JSON.parse(value);
        settingsManager.saveSettings(settings).catch(error => {
          console.error('異步保存設置失敗：', error);
        });
      } catch (error) {
        console.error('設置數據格式錯誤：', error);
      }
      return;
    }
    localStorage.setItem(key, value);
  },

  removeItemSync(key) {
    if (key === 'linuxdoscriptssettingDMI') {
      console.warn('使用同步方法刪除數據，建議使用異步版本');
      settingsManager.clearSettings().catch(error => {
        console.error('異步刪除設置失敗：', error);
      });
      return;
    }
    localStorage.removeItem(key);
  }
};

// 為了最大兼容性，也可以直接替換 localStorage（謹慎使用）
const createLocalStorageProxy = () => {
  return new Proxy(localStorage, {
    get(target, prop) {
      if (prop === 'getItem') {
        return function(key) {
          if (key === 'linuxdoscriptssettingDMI') {
            return storageCompat.getItemSync(key);
          }
          return target.getItem(key);
        };
      }
      
      if (prop === 'setItem') {
        return function(key, value) {
          if (key === 'linuxdoscriptssettingDMI') {
            storageCompat.setItemSync(key, value);
            return;
          }
          return target.setItem(key, value);
        };
      }
      
      if (prop === 'removeItem') {
        return function(key) {
          if (key === 'linuxdoscriptssettingDMI') {
            storageCompat.removeItemSync(key);
            return;
          }
          return target.removeItem(key);
        };
      }
      
      return target[prop];
    }
  });
};

// 輔助函數：等待設置數據加載完成
const waitForSettings = async () => {
  return await settingsManager.getSettings();
};

// 輔助函數：安全地獲取設置數據（同步）
const getSafeSettings = () => {
  const cached = settingsManager.cache;
  if (cached) {
    return cached;
  }
  
  // 如果沒有緩存，嘗試從 localStorage 獲取（作為備用）
  try {
    const localData = localStorage.getItem('linuxdoscriptssettingDMI');
    return localData ? JSON.parse(localData) : null;
  } catch (error) {
    console.error('獲取備用設置數據失敗：', error);
    return null;
  }
};

export default storageCompat;
export { 
  createLocalStorageProxy, 
  waitForSettings, 
  getSafeSettings,
  settingsManager 
};
