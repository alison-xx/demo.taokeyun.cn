<script setup lang="ts">
export type ErrorType = 'network' | 'rate_limit' | 'server' | 'auth' | 'quota' | 'unknown';

const props = withDefaults(defineProps<{
  type?: ErrorType;
  title?: string;
  message?: string;
}>(), {
  type: 'unknown',
});

const emit = defineEmits<{ retry: [] }>();

const config: Record<ErrorType, { icon: string; title: string; message: string }> = {
  network: {
    icon: '🌐',
    title: '网络连接失败',
    message: '请检查网络后重试',
  },
  rate_limit: {
    icon: '⚡',
    title: '请求过于频繁',
    message: '请稍后再试',
  },
  server: {
    icon: '🔧',
    title: '服务器异常',
    message: '服务端出现问题，请稍后重试',
  },
  auth: {
    icon: '🔒',
    title: '认证失效',
    message: '请重新登录后继续',
  },
  quota: {
    icon: '📊',
    title: '额度已用尽',
    message: '当前配额已用完，请升级套餐',
  },
  unknown: {
    icon: '❓',
    title: '出现错误',
    message: '发生了未知错误，请重试',
  },
};

const current = config[props.type] || config.unknown;
</script>

<template>
  <div class="error-card">
    <div class="error-icon">{{ current.icon }}</div>
    <h3 class="error-title">{{ title || current.title }}</h3>
    <p class="error-message">{{ message || current.message }}</p>
    <button class="retry-btn" @click="emit('retry')">重试</button>
  </div>
</template>

<style scoped>
.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  text-align: center;
  gap: 12px;
}

.error-icon { font-size: 48px; }

.error-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #fff);
  margin: 0;
}

.error-message {
  font-size: 14px;
  color: var(--text-secondary, rgba(255,255,255,0.6));
  margin: 0;
}

.retry-btn {
  margin-top: 8px;
  padding: 10px 24px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover { background: #2563eb; }
</style>
