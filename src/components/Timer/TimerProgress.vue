<template>
  <div class="timer-progress">
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimerStore } from '@/stores/timer';

const timerStore = useTimerStore();
const progress = computed(() => timerStore.progress);
</script>

<style scoped>
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

:global(.timer-circle--break) .progress-fill {
  background-color: #10b981;
}

:global(.timer-circle--warning) .progress-fill {
  background-color: #ef4444;
}
</style>
