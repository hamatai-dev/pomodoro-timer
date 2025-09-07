<template>
  <div v-if="timerStore.workers.length === 2" class="role-info-compact">
    <div class="role-display-compact">
      <div class="role-item-compact role-driver" :class="{ 'role-active': phase === 'work' }">
        <span class="role-icon-small">🚗</span>
        <span class="role-name-small">{{ timerStore.currentDriver?.name }}</span>
      </div>
      <div class="role-separator">↔</div>
      <div class="role-item-compact role-navigator" :class="{ 'role-active': phase === 'work' }">
        <span class="role-icon-small">🧭</span>
        <span class="role-name-small">{{ timerStore.currentNavigator?.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimerStore } from '@/stores/timer';

const timerStore = useTimerStore();

const phase = computed(() => timerStore.phase);
</script>

<style scoped>
.role-info-compact {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
  padding: 0.75rem;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.role-display-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.role-item-compact {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 0.4rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  min-width: 80px;
  justify-content: center;
}

.role-item-compact.role-active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.role-icon-small {
  font-size: 1.2rem;
}

.role-name-small {
  font-size: 1.2rem;
  font-weight: 600;
}

.role-separator {
  font-size: 1.5rem;
  opacity: 0.7;
  font-weight: bold;
}

@media (max-width: 768px) {
  .role-display-compact {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .role-item-compact {
    min-width: 70px;
    padding: 0.3rem 0.6rem;
  }

  .role-name-small {
    font-size: 1rem;
  }
}
</style>
