<script setup lang="ts">
withDefaults(defineProps<{
  height?: string;
  width?: string;
  borderRadius?: string;
  mode?: 'local' | 'fullscreen';
}>(), {
  height: '20px',
  width: '100%',
  borderRadius: '6px',
  mode: 'local',
});
</script>

<template>
  <div class="skeleton-wrapper" :class="`mode-${mode}`">
    <div
      class="skeleton-block"
      :style="{
        height,
        width,
        borderRadius,
      }"
    />
  </div>
</template>

<style scoped>
.skeleton-wrapper {
  overflow: hidden;
}

.skeleton-block {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.mode-fullscreen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: var(--bg-primary, #0f1117);
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
