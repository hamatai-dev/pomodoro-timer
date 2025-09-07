import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TimerState, TimerSettings, Worker } from '@/types/timer';
import { minutesToSeconds } from '@/utils/time';
import { saveToStorage, loadFromStorage } from '@/utils/storage';

export const useTimerStore = defineStore('timer', () => {
  // 状態
  const state = ref<TimerState>({
    isRunning: false,
    isPaused: false,
    currentTime: 0,
    totalTime: 0,
    phase: 'work',
    currentWorkSession: 1,
    currentCycle: 1,
    settings: {
      workDuration: 5, // デフォルトを5分に変更
      breakDuration: 5,
      warningTime: 1,
      workSessionsPerCycle: 5 // デフォルトで5回の作業時間
    },
    workers: [
      { id: 'worker-a', name: "Aさん", role: 'driver' },
      { id: 'worker-b', name: "Bさん", role: 'navigator' }
    ],
    currentDriver: { id: 'worker-a', name: "Aさん", role: 'driver' },
    currentNavigator: { id: 'worker-b', name: "Bさん", role: 'navigator' },
    sessionCount: 0
  });

  // ゲッター
  const isRunning = computed(() => state.value.isRunning);
  const isPaused = computed(() => state.value.isPaused);
  const currentTime = computed(() => state.value.currentTime);
  const totalTime = computed(() => state.value.totalTime);
  const phase = computed(() => state.value.phase);
  const settings = computed(() => state.value.settings);
  const currentWorkSession = computed(() => state.value.currentWorkSession);
  const currentCycle = computed(() => state.value.currentCycle);
  const workers = computed(() => state.value.workers);
  const currentDriver = computed(() => state.value.currentDriver);
  const currentNavigator = computed(() => state.value.currentNavigator);
  const sessionCount = computed(() => state.value.sessionCount);

  // 役割情報の表示用
  const roleInfo = computed(() => ({
    driver: state.value.currentDriver,
    navigator: state.value.currentNavigator,
    sessionCount: state.value.sessionCount
  }));

  const progress = computed(() => {
    if (state.value.totalTime === 0) return 0;
    return ((state.value.totalTime - state.value.currentTime) / state.value.totalTime) * 100;
  });

  const shouldShowWarning = computed((): boolean => {
    return state.value.currentTime <= state.value.settings.warningTime * 60;
  });

  // ポモドーロ情報の表示用
  const cycleInfo = computed(() => ({
    currentSession: state.value.currentWorkSession,
    totalSessions: state.value.settings.workSessionsPerCycle,
    currentCycle: state.value.currentCycle,
    phase: state.value.phase
  }));

  // アクション
  function startTimer(duration: number, phaseType: 'work' | 'break' = 'work') {
    state.value.totalTime = minutesToSeconds(duration);
    state.value.currentTime = state.value.totalTime;
    state.value.isRunning = true;
    state.value.isPaused = false;
    state.value.phase = phaseType;
  }

  function pauseTimer() {
    if (state.value.isRunning) {
      state.value.isPaused = !state.value.isPaused;
    }
  }

  function stopTimer() {
    state.value.isRunning = false;
    state.value.isPaused = false;
    state.value.currentTime = 0;
    state.value.totalTime = 0;
    // リセット時はポモドーロ情報もリセット
    state.value.currentWorkSession = 1;
    state.value.currentCycle = 1;
  }

  function tick() {
    if (state.value.isRunning && !state.value.isPaused && state.value.currentTime > 0) {
      state.value.currentTime--;

      // 時間が0になった時の自動切り替え
      if (state.value.currentTime === 0) {
        handleTimerComplete();
      }
    }
  }

  function handleTimerComplete() {
    console.log('handleTimerComplete called, phase:', state.value.phase);
    console.log('sessionCount before:', state.value.sessionCount);

    if (state.value.phase === 'work') {
      // 作業時間が終了
      state.value.sessionCount++; // セッション回数を増加
      console.log('sessionCount after increment:', state.value.sessionCount);

      // 作業セッションが終わるたびに役割を交代（1回目終了後から適用）
      if (state.value.sessionCount >= 1) {
        console.log('Switching roles after work session');
        switchRoles();
      }

      if (state.value.currentWorkSession >= state.value.settings.workSessionsPerCycle) {
        // 指定回数の作業時間が完了したら休憩時間を開始
        state.value.phase = 'break';
        state.value.totalTime = minutesToSeconds(state.value.settings.breakDuration);
        state.value.currentTime = state.value.totalTime;
        state.value.currentWorkSession = 1;
      } else {
        // まだ作業時間が残っている場合は次の作業時間を開始
        state.value.currentWorkSession++;
        state.value.totalTime = minutesToSeconds(state.value.settings.workDuration);
        state.value.currentTime = state.value.totalTime;
      }
    } else {
      // 休憩時間が終了したら新しいポモドーロを開始
      state.value.phase = 'work';
      state.value.currentCycle++;
      state.value.currentWorkSession = 1;
      state.value.totalTime = minutesToSeconds(state.value.settings.workDuration);
      state.value.currentTime = state.value.totalTime;
      // 休憩時間終了時は役割交代しない
    }
  }

  function updateSettings(newSettings: Partial<TimerSettings>) {
    state.value.settings = { ...state.value.settings, ...newSettings };
    saveToStorage('timer-settings', state.value.settings);
  }

  function loadSettings() {
    const savedSettings = loadFromStorage('timer-settings', state.value.settings);
    state.value.settings = savedSettings;
  }

  // 作業者を設定
  function setWorkers(workerA: string, workerB: string) {
    const workers: Worker[] = [
      { id: 'worker-a', name: workerA, role: 'driver' },
      { id: 'worker-b', name: workerB, role: 'navigator' }
    ];

    state.value.workers = workers;
    state.value.currentDriver = workers[0]; // 最初は作業者Aがドライバー
    state.value.currentNavigator = workers[1]; // 作業者Bがナビゲーター
    state.value.sessionCount = 0;

    // ローカルストレージに保存
    saveToStorage('workers', workers);
    saveToStorage('current-roles', {
      driver: state.value.currentDriver,
      navigator: state.value.currentNavigator,
      sessionCount: state.value.sessionCount
    });
  }

  // 役割を交代
  function switchRoles() {
    console.log('switchRoles called');
    console.log('Current driver before:', state.value.currentDriver?.name);
    console.log('Current navigator before:', state.value.currentNavigator?.name);

    if (state.value.workers.length === 2) {
      const temp = state.value.currentDriver;
      state.value.currentDriver = state.value.currentNavigator;
      state.value.currentNavigator = temp;

      console.log('Current driver after:', state.value.currentDriver?.name);
      console.log('Current navigator after:', state.value.currentNavigator?.name);

      // ローカルストレージに保存
      saveToStorage('current-roles', {
        driver: state.value.currentDriver,
        navigator: state.value.currentNavigator,
        sessionCount: state.value.sessionCount
      });
    }
  }

  // 作業者設定を読み込み
  function loadWorkers() {
    const savedWorkers = loadFromStorage('workers', []);
    const savedRoles = loadFromStorage('current-roles', {
      driver: null,
      navigator: null,
      sessionCount: 0
    });

    if (savedWorkers.length === 2) {
      state.value.workers = savedWorkers;
      state.value.currentDriver = savedRoles.driver;
      state.value.currentNavigator = savedRoles.navigator;
      state.value.sessionCount = savedRoles.sessionCount;
    }
  }

  // 初期化時に設定を読み込み
  loadSettings();
  loadWorkers();

  return {
    // 状態
    state,
    // ゲッター
    isRunning,
    isPaused,
    currentTime,
    totalTime,
    phase,
    settings,
    currentWorkSession,
    currentCycle,
    progress,
    shouldShowWarning,
    cycleInfo,
    workers,
    currentDriver,
    currentNavigator,
    sessionCount,
    roleInfo,
    // アクション
    startTimer,
    pauseTimer,
    stopTimer,
    tick,
    updateSettings,
    loadSettings,
    setWorkers,
    switchRoles,
    loadWorkers
  };
});
