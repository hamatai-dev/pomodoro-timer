/**
 * ローカルストレージにデータを保存
 */
export function saveToStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
  
  /**
   * ローカルストレージからデータを取得
   */
  export function loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }
  
  /**
   * ローカルストレージからデータを削除
   */
  export function removeFromStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }