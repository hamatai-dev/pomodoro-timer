<template>
  <div class="timer-display">
    <TimerHeader />
    <div class="timer-main">
      <TimerCircle />
      <TimerProgress />
    </div>
  </div>
</template>

<script setup lang="ts">
import TimerHeader from './TimerHeader.vue';
import TimerCircle from './TimerCircle.vue';
import TimerProgress from './TimerProgress.vue';
</script>

<style scoped>
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
}

.timer-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

@media (max-width: 768px) {
  .timer-display {
    gap: 1rem;
    padding: 0.5rem;
  }
}
</style>
