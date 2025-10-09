// IndexedDB 存儲調試工具
class StorageDebugger {
  // 檢查對象是否可以被 IndexedDB 存儲
  static canBeStored(obj, path = 'root') {
    const issues = [];
    
    try {
      // 嘗試 JSON 序列化
      JSON.stringify(obj);
    } catch (error) {
      issues.push({
        path,
        issue: 'JSON 序列化失敗',
        error: error.message,
        type: typeof obj
      });
      return { canStore: false, issues };
    }

    // 遞歸檢查對象屬性
    this._checkObjectRecursively(obj, path, issues, new Set());
    
    return {
      canStore: issues.length === 0,
      issues
    };
  }

  // 遞歸檢查對象
  static _checkObjectRecursively(obj, path, issues, visited) {
    // 防止循環引用
    if (visited.has(obj)) {
      issues.push({
        path,
        issue: '循環引用',
        type: typeof obj
      });
      return;
    }

    if (obj && typeof obj === 'object') {
      visited.add(obj);
    }

    // 檢查各種不可存儲的類型
    if (typeof obj === 'function') {
      issues.push({
        path,
        issue: '函數不可存儲',
        type: 'function'
      });
      return;
    }

    if (typeof obj === 'symbol') {
      issues.push({
        path,
        issue: 'Symbol 不可存儲',
        type: 'symbol'
      });
      return;
    }

    if (obj === undefined) {
      issues.push({
        path,
        issue: 'undefined 不可存儲',
        type: 'undefined'
      });
      return;
    }

    // 檢查 DOM 元素
    if (obj && typeof obj === 'object' && obj.nodeType) {
      issues.push({
        path,
        issue: 'DOM 元素不可存儲',
        type: 'DOM Element'
      });
      return;
    }

    // 檢查特殊對象
    if (obj instanceof Error) {
      issues.push({
        path,
        issue: 'Error 對象可能有問題',
        type: 'Error',
        suggestion: '建議轉換為普通對象'
      });
    }

    if (obj instanceof RegExp) {
      issues.push({
        path,
        issue: 'RegExp 對象需要特殊處理',
        type: 'RegExp',
        suggestion: '建議轉換為字符串'
      });
    }

    // 遞歸檢查對象屬性
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this._checkObjectRecursively(
            obj[key], 
            `${path}.${key}`, 
            issues, 
            visited
          );
        }
      }
    }

    // 遞歸檢查數組元素
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this._checkObjectRecursively(
          item, 
          `${path}[${index}]`, 
          issues, 
          visited
        );
      });
    }

    if (obj && typeof obj === 'object') {
      visited.delete(obj);
    }
  }

  // 生成詳細的調試報告
  static generateReport(obj, objectName = 'settings') {
    console.group(`🔍 IndexedDB 存儲檢查報告 - ${objectName}`);
    
    const result = this.canBeStored(obj);
    
    if (result.canStore) {
      console.log('✅ 對象可以安全存儲到 IndexedDB');
    } else {
      console.warn('❌ 對象包含不可存儲的屬性');
      console.table(result.issues);
      
      console.group('📋 修復建議');
      result.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.path}: ${issue.issue}`);
        if (issue.suggestion) {
          console.log(`   💡 建議：${issue.suggestion}`);
        }
      });
      console.groupEnd();
    }
    
    // 顯示對象大小信息
    try {
      const jsonString = JSON.stringify(obj);
      const sizeInBytes = new Blob([jsonString]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      console.log(`📊 對象大小：${sizeInKB} KB (${sizeInBytes} bytes)`);
    } catch (error) {
      console.warn('無法計算對象大小：', error.message);
    }
    
    console.groupEnd();
    return result;
  }

  // 嘗試修復對象
  static attemptFix(obj) {
    console.log('🔧 嘗試自動修復對象...');
    
    try {
      // 使用深度克隆和清理
      const fixed = this._deepCleanObject(obj);
      const checkResult = this.canBeStored(fixed);
      
      if (checkResult.canStore) {
        console.log('✅ 對象修復成功');
        return { success: true, data: fixed };
      } else {
        console.warn('⚠️ 部分問題仍然存在');
        console.table(checkResult.issues);
        return { success: false, data: fixed, issues: checkResult.issues };
      }
    } catch (error) {
      console.error('❌ 修復失敗：', error);
      return { success: false, error: error.message };
    }
  }

  // 深度清理對象
  static _deepCleanObject(obj, visited = new WeakSet()) {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // 處理基本類型
    if (typeof obj !== 'object') {
      return obj;
    }

    // 防止循環引用
    if (visited.has(obj)) {
      return '[Circular Reference]';
    }
    visited.add(obj);

    // 處理日期
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    // 處理正則表達式
    if (obj instanceof RegExp) {
      return obj.toString();
    }

    // 處理錯誤對象
    if (obj instanceof Error) {
      return {
        name: obj.name,
        message: obj.message,
        stack: obj.stack
      };
    }

    // 處理數組
    if (Array.isArray(obj)) {
      return obj.map(item => this._deepCleanObject(item, visited));
    }

    // 處理普通對象
    const cleaned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        // 跳過不可序列化的類型
        if (typeof value === 'function' || 
            typeof value === 'symbol' || 
            value === undefined ||
            (value && typeof value === 'object' && value.nodeType)) {
          continue;
        }
        
        try {
          cleaned[key] = this._deepCleanObject(value, visited);
        } catch (error) {
          console.warn(`跳過屬性 ${key}:`, error.message);
        }
      }
    }
    
    return cleaned;
  }
}

// 全局調試函數
window.debugIndexedDBStorage = (obj, name) => {
  return StorageDebugger.generateReport(obj, name);
};

window.fixStorageObject = (obj) => {
  return StorageDebugger.attemptFix(obj);
};

export default StorageDebugger;
