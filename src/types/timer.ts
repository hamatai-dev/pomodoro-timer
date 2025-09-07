export interface TimerSettings {
  workDuration: number; // 分
  breakDuration: number; // 分
  warningTime: number; // 残り何分で警告するか
  workSessionsPerCycle: number; // 1ポモドーロあたりの作業時間の回数
}

// 作業者の役割
export type WorkerRole = 'driver' | 'navigator';

// 作業者の情報
export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
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
  workers: Worker[];
  currentDriver: Worker | null;
  currentNavigator: Worker | null;
  sessionCount: number; // セッション回数（役割交代の判定用）
}
