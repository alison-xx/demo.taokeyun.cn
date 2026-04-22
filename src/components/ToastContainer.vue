<script setup lang="ts">
import { ref, provide } from 'vue';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

const DURATION = 3000;
const MAX_TOASTS = 5;

const addToast = (message: string, type: ToastType = 'info') => {
  if (toasts.value.length >= MAX_TOASTS) {
    toasts.value.shift();
  }
  const id = ++nextId;
  toasts.value.push({ id, message, type });
  setTimeout(() => removeToast(id), DURATION);
};

const removeToast = (id: number) => {
  const idx = toasts.value.findIndex(t => t.id === id);
  if (idx !== -1) toasts.value.splice(idx, 1);
};

const success = (msg: string) => addToast(msg, 'success');
const error = (msg: string) => addToast(msg, 'error');
const warning = (msg: string) => addToast(msg, 'warning');
const info = (msg: string) => addToast(msg, 'info');

provide('toast', { success, error, warning, info });
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.type}`"
          @click="removeToast(toast.id)"
        >
          <span class="toast-icon">
            <template v-if="toast.type === 'success'">✓</template>
            <template v-else-if="toast.type === 'error'">✕</template>
            <template v-else-if="toast.type === 'warning'">⚠</template>
            <template v-else>ℹ</template>
          </span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  min-width: 240px;
  max-width: 360px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  pointer-events: all;
  backdrop-filter: blur(8px);
}

.toast-success { background: rgba(34, 197, 94, 0.9); color: #fff; }
.toast-error   { background: rgba(239, 68, 68, 0.9); color: #fff; }
.toast-warning { background: rgba(234, 179, 8, 0.9); color: #000; }
.toast-info    { background: rgba(59, 130, 246, 0.9); color: #fff; }

.toast-icon { font-size: 16px; flex-shrink: 0; }
.toast-msg  { line-height: 1.4; }

.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(40px); }
.toast-leave-to     { opacity: 0; transform: translateX(40px); }
</style>
