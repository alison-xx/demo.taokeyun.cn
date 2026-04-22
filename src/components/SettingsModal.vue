<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import request from '../utils/request';

defineProps<{ show: boolean }>();
const emit = defineEmits(['close']);
const authStore = useAuthStore();

const nickname = ref(authStore.user?.username || '');
const toastMsg = ref('');

const saveProfile = async () => {
  try {
    const res = await authStore.updateProfile({ nickname: nickname.value });
    if ((res as any).data?.code === 200) {
      toastMsg.value = '保存成功';
      setTimeout(() => { toastMsg.value = ''; }, 2000);
    } else {
      toastMsg.value = (res as any).data?.message || '保存失败';
      setTimeout(() => { toastMsg.value = ''; }, 2000);
    }
  } catch (error) {
    toastMsg.value = '保存失败';
    setTimeout(() => { toastMsg.value = ''; }, 2000);
  }
};

onMounted(async () => {
  if (authStore.accessToken) {
    try {
      const res: any = await request.get('/auth/profile');
      if (res.code === 200) {
         nickname.value = res.data.username;
      }
    } catch(e) {}
  }
});
</script>

<template>
  <div
    v-if="show"
    class="api-settings-overlay"
    style="display: flex;"
  >
    <div class="api-settings-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 class="api-settings-title">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle
              cx="12"
              cy="7"
              r="4"
            />
          </svg>
          个人设置
        </h2>
        <button
          class="settings-close-btn"
          @click="emit('close')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            width="20"
            height="20"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            />
          </svg>
        </button>
      </div>

      <!-- 用户信息 -->
      <div class="settings-user-info">
        <div class="settings-avatar">
          {{ authStore.user?.username?.charAt(0) || '用' }}
        </div>
        <div class="settings-user-details">
          <div class="settings-username">
            {{ authStore.user?.username }}
          </div>
          <div class="settings-email">
            {{ authStore.user?.email }}
          </div>
        </div>
      </div>

      <div class="settings-divider" />

      <!-- 基本设置 -->
      <div class="settings-section">
        <h3 class="settings-section-title">
          基本设置
        </h3>
        
        <div class="settings-item">
          <label class="settings-label">昵称</label>
          <input
            v-model="nickname"
            type="text"
            class="settings-input"
            placeholder="请输入昵称"
          >
        </div>
        
        <div class="settings-item">
          <button
            class="settings-btn-primary"
            @click="saveProfile"
          >
            保存设置
          </button>
        </div>
      </div>

      <div class="settings-divider" />

      <!-- 账户操作 -->
      <div class="settings-actions">
        <button
          class="settings-btn-danger"
          @click="authStore.logout(); emit('close')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            width="16"
            height="16"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
            />
          </svg>
          退出登录
        </button>
      </div>
      
      <div
        v-if="toastMsg"
        class="api-settings-note"
        style="color: #3DDC84; text-align: center; margin-top: 10px;"
      >
        {{ toastMsg }}
      </div>
    </div>
  </div>
</template>