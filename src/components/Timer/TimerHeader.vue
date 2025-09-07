<template>
  <div class="timer-header">
    <TimerCycleInfo />
    <TimerRoleDisplay />
  </div>
</template>

<script setup lang="ts">
import TimerCycleInfo from './TimerCycleInfo.vue';
import TimerRoleDisplay from './TimerRoleDisplay.vue';
</script>

<style scoped>
.timer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 1rem;
}

@media (max-width: 768px) {
  .timer-header {
    gap: 0.75rem;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .timer-header {
    flex-direction: column;
  }
}
</style>
