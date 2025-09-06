/**
 * 分を秒に変換
 */
export function minutesToSeconds(minutes: number): number {
    return minutes * 60;
  }
  
  /**
   * 秒を分に変換
   */
  export function secondsToMinutes(seconds: number): number {
    return Math.floor(seconds / 60);
  }
  
  /**
   * 秒を時間:分:秒の形式にフォーマット
   */
  export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }