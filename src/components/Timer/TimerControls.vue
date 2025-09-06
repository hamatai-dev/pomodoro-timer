<template>
  <div class="timer-controls">
    <div class="control-buttons">
      <!-- タイマーが停止している時 -->
      <template v-if="!isRunning">
        <button 
          @click="startWork"
          class="btn btn--primary"
        >
          作業開始
        </button>
        <button 
          @click="startBreak"
          class="btn btn--secondary"
        >
          休憩開始
        </button>
      </template>
      
      <!-- タイマーが動作している時 -->
      <template v-if="isRunning">
        <button 
          @click="pauseTimer"
          class="btn btn--warning"
        >
          {{ isPaused ? '再開' : '一時停止' }}
        </button>
        <button 
          @click="stopTimer"
          class="btn btn--danger"
        >
          停止
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimerStore } from '@/stores/timer';

const timerStore = useTimerStore();

// computedを使ってリアクティブに値を取得
const isRunning = computed(() => timerStore.isRunning);
const isPaused = computed(() => timerStore.isPaused);

function startWork() {
  console.log('作業開始ボタンが押されました');
  timerStore.startTimer(timerStore.settings.workDuration, 'work');
}

function startBreak() {
  console.log('休憩開始ボタンが押されました');
  timerStore.startTimer(timerStore.settings.breakDuration, 'break');
}

function pauseTimer() {
  console.log('一時停止/再開ボタンが押されました');
  timerStore.pauseTimer();
}

function stopTimer() {
  console.log('停止ボタンが押されました');
  timerStore.stopTimer();
}
</script>

<style scoped>
.timer-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn--primary {
  background-color: #3b82f6;
  color: white;
}

.btn--primary:hover {
  background-color: #2563eb;
}

.btn--secondary {
  background-color: #10b981;
  color: white;
}

.btn--secondary:hover {
  background-color: #059669;
}

.btn--warning {
  background-color: #f59e0b;
  color: white;
}

.btn--warning:hover {
  background-color: #d97706;
}

.btn--danger {
  background-color: #ef4444;
  color: white;
}

.btn--danger:hover {
  background-color: #dc2626;
}
</style>