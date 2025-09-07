<template>
  <div class="timer-circle" :class="timerClasses">
    <div class="timer-time">
      {{ formattedTime }}
    </div>
    <div class="timer-phase">
      {{ phaseText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimerStore } from '@/stores/timer';
import { formatTime } from '@/utils/time';

const timerStore = useTimerStore();

const formattedTime = computed(() => formatTime(timerStore.currentTime));
const phase = computed(() => timerStore.phase);

const phaseText = computed(() => {
  return phase.value === 'work' ? '作業時間' : '休憩時間';
});

const timerClasses = computed(() => ({
  'timer-circle--work': phase.value === 'work',
  'timer-circle--break': phase.value === 'break',
  'timer-circle--warning': timerStore.shouldShowWarning
}));
</script>

<style scoped>
.timer-circle {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 8px solid;
  transition: all 0.3s ease;
}

.timer-circle--work {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

.timer-circle--break {
  border-color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.timer-circle--warning {
  border-color: #ef4444 !important;
  background-color: rgba(239, 68, 68, 0.1) !important;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.timer-time {
  font-size: 3.5rem;
  font-weight: bold;
  color: #1f2937;
  font-family: 'Courier New', monospace;
}

.timer-phase {
  font-size: 1.25rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .timer-circle {
    width: 280px;
    height: 280px;
  }

  .timer-time {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .timer-circle {
    width: 240px;
    height: 240px;
  }

  .timer-time {
    font-size: 2.5rem;
  }
}

@media (max-width: 360px) {
  .timer-circle {
    width: 200px;
    height: 200px;
  }

  .timer-time {
    font-size: 2rem;
  }

  .timer-phase {
    font-size: 1rem;
  }
}
</style>
