<template>
  <div class="timer-settings">
    <!-- 作業者設定セクション（上部） -->
    <div class="worker-settings">
      <h3>作業者設定</h3>

      <div class="worker-inputs">
        <div class="setting-item">
          <label for="worker-a">作業者A（初回ドライバー）</label>
          <input
            id="worker-a"
            v-model="localWorkerA"
            type="text"
            placeholder="作業者Aの名前を入力"
            class="setting-input"
            maxlength="20"
          />
        </div>

        <div class="setting-item">
          <label for="worker-b">作業者B（初回ナビゲーター）</label>
          <input
            id="worker-b"
            v-model="localWorkerB"
            type="text"
            placeholder="作業者Bの名前を入力"
            class="setting-input"
            maxlength="20"
          />
        </div>
      </div>
    </div>

    <!-- タイマー設定セクション（下部） -->
    <div class="timer-settings-section">
      <h3>タイマー設定</h3>

      <div class="settings-form">
        <div class="setting-item">
          <label for="work-duration">作業時間（分）</label>
          <input
            id="work-duration"
            v-model.number="localSettings.workDuration"
            type="number"
            min="1"
            max="60"
            class="setting-input"
          />
        </div>

        <div class="setting-item">
          <label for="break-duration">休憩時間（分）</label>
          <input
            id="break-duration"
            v-model.number="localSettings.breakDuration"
            type="number"
            min="1"
            max="30"
            class="setting-input"
          />
        </div>

        <div class="setting-item">
          <label for="work-sessions">1ポモドーロあたりの作業回数</label>
          <input
            id="work-sessions"
            v-model.number="localSettings.workSessionsPerCycle"
            type="number"
            min="1"
            max="10"
            class="setting-input"
          />
          <small class="setting-help">
            {{ localSettings.workSessionsPerCycle }}回の作業時間の後に{{ localSettings.breakDuration }}分の休憩時間が1回実行されます
          </small>
        </div>

        <div class="setting-item">
          <label for="warning-time">警告時間（分）</label>
          <input
            id="warning-time"
            v-model.number="localSettings.warningTime"
            type="number"
            min="1"
            max="5"
            class="setting-input"
          />
        </div>
      </div>
    </div>

    <!-- 設定アクション（最下部） -->
    <div class="setting-actions">
      <button @click="saveSettings" class="btn btn--primary">
        設定を保存
      </button>
      <button @click="resetSettings" class="btn btn--secondary">
        リセット
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { useTimerStore } from '@/stores/timer';
import type { TimerSettings } from '@/types/timer';

const timerStore = useTimerStore();

// ローカルの設定状態
const localSettings = reactive<TimerSettings>({
  workDuration: 5,
  breakDuration: 5,
  warningTime: 1,
  workSessionsPerCycle: 5
});

// 作業者設定のローカル状態
const localWorkerA = ref('');
const localWorkerB = ref('');

// 設定を読み込み
function loadSettings() {
  const settings = timerStore.settings;
  localSettings.workDuration = settings.workDuration;
  localSettings.breakDuration = settings.breakDuration;
  localSettings.warningTime = settings.warningTime;
  localSettings.workSessionsPerCycle = settings.workSessionsPerCycle;

  // 作業者設定を読み込み
  loadWorkers();
}

// 作業者設定を読み込み
function loadWorkers() {
  if (timerStore.workers.length === 2) {
    localWorkerA.value = timerStore.workers[0].name;
    localWorkerB.value = timerStore.workers[1].name;
  }
}

// 設定を保存
function saveSettings() {
  // タイマー設定を保存
  timerStore.updateSettings(localSettings);

  // 作業者設定を保存
  if (localWorkerA.value.trim() && localWorkerB.value.trim()) {
    timerStore.setWorkers(localWorkerA.value.trim(), localWorkerB.value.trim());
  }

  alert('設定を保存しました！');
}

// 設定をリセット
function resetSettings() {
  const defaultSettings: TimerSettings = {
    workDuration: 5,
    breakDuration: 5,
    warningTime: 1,
    workSessionsPerCycle: 5
  };

  Object.assign(localSettings, defaultSettings);
  timerStore.updateSettings(defaultSettings);

  // 作業者設定もリセット
  localWorkerA.value = '';
  localWorkerB.value = '';

  alert('設定をリセットしました！');
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.timer-settings {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 作業者設定セクション（上部） */
.worker-settings h3 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.worker-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .worker-inputs {
    grid-template-columns: 1fr;
  }
}

/* タイマー設定セクション（下部） */
.timer-settings-section {
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.timer-settings-section h3 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.setting-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  max-width: 200px;
}

.setting-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.setting-help {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* 設定アクション */
.setting-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn--primary {
  background-color: #3b82f6;
  color: white;
}

.btn--primary:hover {
  background-color: #2563eb;
}

.btn--secondary {
  background-color: #6b7280;
  color: white;
}

.btn--secondary:hover {
  background-color: #4b5563;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .timer-settings {
    padding: 1.5rem;
  }

  .setting-actions {
    flex-direction: column;
  }
}
</style>
