<template>
    <div class="tabs">
      <div class="tabs-header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          class="tab-button"
          :class="{ 'tab-button--active': activeTab === tab.id }"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
      <div class="tabs-content">
        <slot :activeTab="activeTab" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface Tab {
    id: string;
    label: string;
    icon: string;
  }
  
  const props = defineProps<{
    tabs: Tab[];
    defaultTab?: string;
  }>();
  
  const activeTab = ref(props.defaultTab || props.tabs[0]?.id);
  
  function setActiveTab(tabId: string) {
    activeTab.value = tabId;
  }
  </script>
  
  <style scoped>
  .tabs {
    width: 100%;
  }
  
  .tabs-header {
    display: flex;
    background: #f8fafc;
    border-radius: 0.75rem 0.75rem 0 0;
    border: 1px solid #e2e8f0;
    border-bottom: none;
    overflow-x: auto;
  }
  
  .tab-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    border-bottom: 3px solid transparent;
  }
  
  .tab-button:hover {
    background: rgba(59, 130, 246, 0.05);
  }
  
  .tab-button--active {
    background: white;
    border-bottom-color: #3b82f6;
    color: #3b82f6;
    font-weight: 600;
  }
  
  .tab-icon {
    font-size: 1.25rem;
  }
  
  .tab-label {
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .tabs-content {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0 0 0.75rem 0.75rem;
    padding: 2rem;
    min-height: 400px;
  }
  
  @media (max-width: 768px) {
    .tabs-header {
      flex-wrap: wrap;
    }
    
    .tab-button {
      flex: 1;
      min-width: 120px;
      justify-content: center;
    }
    
    .tabs-content {
      padding: 1.5rem;
    }
  }
  </style>