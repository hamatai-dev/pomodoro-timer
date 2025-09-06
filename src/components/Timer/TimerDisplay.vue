<template>
    <div class="timer-display">
      <!-- ポモドーロ情報表示 -->
      <div class="cycle-info">
        <div class="cycle-stats">
          <span class="cycle-text">ポモドーロ {{ currentCycle }}</span>
          <span class="session-text">
            {{ phase === 'work' ? '作業' : '休憩' }} 
            {{ phase === 'work' ? `${currentWorkSession}/${settings.workSessionsPerCycle}` : '' }}
          </span>
        </div>
      </div>
  
      <div class="timer-circle" :class="timerClasses">
        <div class="timer-time">
          {{ formattedTime }}
        </div>
        <div class="timer-phase">
          {{ phaseText }}
        </div>
      </div>
      <div class="timer-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useTimerStore } from '@/stores/timer';
  import { formatTime } from '@/utils/time';
  
  const timerStore = useTimerStore();
  
  const formattedTime = computed(() => formatTime(timerStore.currentTime));
  const progress = computed(() => timerStore.progress);
  const phase = computed(() => timerStore.phase);
  const currentWorkSession = computed(() => timerStore.currentWorkSession);
  const currentCycle = computed(() => timerStore.currentCycle);
  const settings = computed(() => timerStore.settings);
  
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
  .timer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  .cycle-info {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 1rem 1.5rem;
    border: 1px solid #e2e8f0;
  }
  
  .cycle-stats {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .cycle-text {
    color: #3b82f6;
  }
  
  .session-text {
    color: #6b7280;
  }
  
  .timer-circle {
    width: 300px;
    height: 300px;
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
    font-size: 3rem;
    font-weight: bold;
    color: #1f2937;
    font-family: 'Courier New', monospace;
  }
  
  .timer-phase {
    font-size: 1.2rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }
  
  .timer-progress {
    width: 100%;
    max-width: 400px;
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #3b82f6;
    transition: width 0.3s ease;
  }
  
  .timer-circle--break .progress-fill {
    background-color: #10b981;
  }
  
  .timer-circle--warning .progress-fill {
    background-color: #ef4444;
  }
  </style>