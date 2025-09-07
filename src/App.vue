<template>
  <div class="app">
    <main class="app-main">
      <div class="timer-section">
        <AppTabs :tabs="tabs" default-tab="timer">
          <template #default="{ activeTab }">
            <!-- タイマータブ -->
            <div v-if="activeTab === 'timer'" class="tab-content">
              <TimerDisplay />
              <TimerControls />
            </div>
            <!-- 設定タブ -->
            <div v-if="activeTab === 'settings'" class="tab-content">
              <TimerSettings />
            </div>
          </template>
        </AppTabs>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useTimerStore } from '@/stores/timer';
import AppTabs from '@/components/ui/AppTabs.vue';
import TimerDisplay from '@/components/Timer/TimerDisplay.vue';
import TimerControls from '@/components/Timer/TimerControls.vue';
import TimerSettings from '@/components/Timer/TimerSettings.vue';

const timerStore = useTimerStore();

// タブの定義
const tabs = [
  { id: 'timer', label: 'タイマー', icon: '⏱️' },
  { id: 'settings', label: '設定', icon: '⚙️' },
];

let intervalId: ReturnType<typeof setInterval> | null = null;

// タイマーの自動進行
function startTimerInterval() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    timerStore.tick();
  }, 1000);
}

function stopTimerInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// タイマーの状態を監視してインターバルを制御
function watchTimerState() {
  if (timerStore.isRunning && !timerStore.isPaused) {
    startTimerInterval();
  } else {
    stopTimerInterval();
  }
}

// タイマーの状態を監視
watch(
  [() => timerStore.isRunning, () => timerStore.isPaused],
  () => {
    watchTimerState();
  },
  { immediate: true }
);

onMounted(() => {
  // 初期状態をチェック
  watchTimerState();
});

onUnmounted(() => {
  stopTimerInterval();
});
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.app-main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
}

.timer-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: 100%;
  overflow: hidden;
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .timer-section {
    margin: 0;
  }

  .tab-content {
    padding: 1.5rem;
  }
}
</style>
