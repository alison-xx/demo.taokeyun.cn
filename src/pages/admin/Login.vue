<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '../../stores/adminAuth';

const router = useRouter();
const adminStore = useAdminStore();

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码';
    return;
  }
  isLoading.value = true;
  errorMsg.value = '';
  try {
    const res = await adminStore.login(username.value, password.value);
    if (res?.code === 200) {
      router.push('/admin');
    } else {
      errorMsg.value = res?.message || '登录失败';
    }
  } catch {
    errorMsg.value = '网络错误，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>灵策·管理后台</h1>
        <p>请使用管理员账号登录</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="username" type="text" placeholder="请输入用户名" autocomplete="username" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" autocomplete="current-password" />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="login-footer">
        <p class="hint">默认账号: admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f1117 0%, #1a1b26 100%);
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.login-header { text-align: center; margin-bottom: 32px; }
.login-header h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
.login-header p { font-size: 14px; color: #64748b; margin: 0; }

.login-form { display: flex; flex-direction: column; gap: 20px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 14px; font-weight: 500; color: #374151; }
.form-group input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus { border-color: #3b82f6; }

.error-msg { color: #ef4444; font-size: 13px; margin: -8px 0 0; }

.login-btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.login-btn:hover:not(:disabled) { background: #2563eb; }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.login-footer { margin-top: 24px; text-align: center; }
.hint { font-size: 12px; color: #94a3b8; }
</style>
