import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TimerState, TimerSettings } from '@/types/timer';
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
    }
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
    if (state.value.phase === 'work') {
      // 作業時間が終了
      if (state.value.currentWorkSession >= state.value.settings.workSessionsPerCycle) {
        // 指定回数の作業時間が完了したら休憩時間を開始
        state.value.phase = 'break';
        state.value.totalTime = minutesToSeconds(state.value.settings.breakDuration);
        state.value.currentTime = state.value.totalTime;
        // 作業セッション数をリセット（休憩後に新しいポモドーロが始まる）
        state.value.currentWorkSession = 1;
      } else {
        // まだ作業時間が残っている場合は次の作業時間を開始
        state.value.currentWorkSession++;
        state.value.totalTime = minutesToSeconds(state.value.settings.workDuration);
        state.value.currentTime = state.value.totalTime;
        // フェーズは'work'のまま
      }
    } else {
      // 休憩時間が終了したら新しいポモドーロを開始
      state.value.phase = 'work';
      state.value.currentCycle++;
      state.value.currentWorkSession = 1; // 新しいポモドーロの最初の作業時間
      state.value.totalTime = minutesToSeconds(state.value.settings.workDuration);
      state.value.currentTime = state.value.totalTime;
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

  // 初期化時に設定を読み込み
  loadSettings();

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
    // アクション
    startTimer,
    pauseTimer,
    stopTimer,
    tick,
    updateSettings,
    loadSettings
  };
});