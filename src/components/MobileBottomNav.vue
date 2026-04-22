<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  active?: string;
}>(), { active: 'home' });

const emit = defineEmits<{ navigate: [name: string] }>();

const tabs = [
  { name: 'home',    label: '首页',    icon: '🏠' },
  { name: 'history', label: '历史',    icon: '📜' },
  { name: 'fav',     label: '收藏',    icon: '⭐' },
  { name: 'mine',    label: '我的',    icon: '👤' },
];

const activeTab = computed(() => props.active);
</script>

<template>
  <nav class="mobile-nav" role="navigation" aria-label="主导航">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      class="nav-item"
      :class="{ active: activeTab === tab.name }"
      @click="emit('navigate', tab.name)"
    >
      <span class="nav-icon">{{ tab.icon }}</span>
      <span class="nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--bg-secondary, #1a1b26);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 1000;
  padding: 0 8px;
}

@media (max-width: 768px) {
  .mobile-nav { display: flex; }
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  color: var(--text-secondary, rgba(255,255,255,0.5));
  transition: color 0.2s;
}

.nav-item.active { color: #3b82f6; }

.nav-icon { font-size: 20px; }
.nav-label { font-size: 10px; }
</style>
