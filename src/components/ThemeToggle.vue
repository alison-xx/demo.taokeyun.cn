<script setup lang="ts">
import { ref, watch } from 'vue';

type Theme = 'light' | 'dark';

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'dark');

const applyTheme = (t: Theme) => {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
};

const toggle = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

watch(theme, (t) => applyTheme(t), { immediate: true });
</script>

<template>
  <button class="theme-toggle" :title="`切换到${theme === 'dark' ? '浅色' : '深色'}模式`" @click="toggle">
    <span v-if="theme === 'dark'" class="icon">☀️</span>
    <span v-else class="icon">🌙</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.theme-toggle:hover { background: rgba(255, 255, 255, 0.15); }
.icon { display: block; }
</style>
