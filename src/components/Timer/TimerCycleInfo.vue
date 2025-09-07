<template>
  <div class="cycle-info-compact">
    <span class="cycle-text">ポモドーロ {{ currentCycle }}</span>
    <span class="session-text">
      {{ phase === 'work' ? '作業' : '休憩' }}
      {{ phase === 'work' ? `${currentWorkSession}/${settings.workSessionsPerCycle}` : '' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimerStore } from '@/stores/timer';

const timerStore = useTimerStore();

const phase = computed(() => timerStore.phase);
const currentWorkSession = computed(() => timerStore.currentWorkSession);
const currentCycle = computed(() => timerStore.currentCycle);
const settings = computed(() => timerStore.settings);
</script>

<style scoped>
.cycle-info-compact {
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.cycle-text {
  color: #3b82f6;
  font-size: 1.2rem;
  font-weight: 600;
}

.session-text {
  color: #6b7280;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .cycle-info-compact {
    text-align: center;
  }
}
</style>
