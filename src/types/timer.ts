export interface TimerSettings {
  workDuration: number; // 分
  breakDuration: number; // 分
  warningTime: number; // 残り何分で警告するか
  workSessionsPerCycle: number; // 1ポモドーロあたりの作業時間の回数
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number; // 秒
  totalTime: number; // 秒
  phase: 'work' | 'break';
  settings: TimerSettings;
  currentWorkSession: number; // 現在の作業セッション数（1から開始）
  currentCycle: number; // 現在のポモドーロ数（1から開始）
}