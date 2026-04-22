<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import request from '../utils/request';

defineProps<{ show: boolean }>();
const emit = defineEmits(['close']);
const authStore = useAuthStore();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const nickname = ref('');
const confirmPassword = ref('');
const resetCode = ref('');
const resetPassword = ref('');
const resetConfirmPassword = ref('');
const errorMsg = ref('');
const isSubmitting = ref(false);
const rememberEmail = ref(true);
const showPassword = ref(false);
const showForgotPasswordPanel = ref(false);
const isSendingResetCode = ref(false);
const resetCodeCountdown = ref(0);

const EMAIL_STORAGE_KEY = 'rememberedEmail';
let resetCodeTimer: number | undefined;

const validateForm = () => {
  const emailValue = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValue) {
    errorMsg.value = '请输入邮箱';
    return false;
  }

  if (!emailPattern.test(emailValue)) {
    errorMsg.value = '请输入正确的邮箱格式';
    return false;
  }

  if (showForgotPasswordPanel.value) {
    if (!resetCode.value.trim()) {
      errorMsg.value = '请输入验证码';
      return false;
    }

    if (resetPassword.value.trim().length < 6) {
      errorMsg.value = '新密码长度不能少于 6 位';
      return false;
    }

    if (resetPassword.value.trim() !== resetConfirmPassword.value.trim()) {
      errorMsg.value = '两次输入的新密码不一致';
      return false;
    }

    return true;
  }

  const passwordValue = password.value.trim();
  if (!passwordValue) {
    errorMsg.value = '请输入密码';
    return false;
  }

  if (!isLogin.value) {
    if (!nickname.value.trim()) {
      errorMsg.value = '请输入昵称';
      return false;
    }

    if (passwordValue.length < 6) {
      errorMsg.value = '密码长度不能少于 6 位';
      return false;
    }

    if (passwordValue !== confirmPassword.value.trim()) {
      errorMsg.value = '两次输入的密码不一致';
      return false;
    }
  }

  return true;
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  errorMsg.value = '';
  if (!validateForm()) return;
  isSubmitting.value = true;
  try {
    if (showForgotPasswordPanel.value) {
      const res: any = await request.post('/auth/password-reset/confirm', {
        email: email.value.trim(),
        code: resetCode.value.trim(),
        password: resetPassword.value.trim(),
      });

      if (res.code === 200) {
        showForgotPasswordPanel.value = false;
        password.value = '';
        resetCode.value = '';
        resetPassword.value = '';
        resetConfirmPassword.value = '';
        errorMsg.value = '';
        isLogin.value = true;
        return;
      }

      errorMsg.value = res.message;
      return;
    }

    const url = isLogin.value ? '/auth/login' : '/auth/register';
    const payload = isLogin.value
      ? { email: email.value.trim(), password: password.value }
      : { email: email.value.trim(), password: password.value, nickname: nickname.value.trim() };
    const res: any = await request.post(url, payload);
    
    if (res.code === 200) {
      if (rememberEmail.value) {
        localStorage.setItem(EMAIL_STORAGE_KEY, email.value.trim());
      } else {
        localStorage.removeItem(EMAIL_STORAGE_KEY);
      }
      authStore.setAuth(res.data.token, res.data.user);
      emit('close');
    } else {
      errorMsg.value = res.message;
    }
  } catch (err: any) {
    errorMsg.value = err.message || '操作失败，请稍后重试';
  } finally {
    isSubmitting.value = false;
  }
};

const switchMode = (loginMode: boolean) => {
  isLogin.value = loginMode;
  errorMsg.value = '';
  confirmPassword.value = '';
  showForgotPasswordPanel.value = false;
  resetCode.value = '';
  resetPassword.value = '';
  resetConfirmPassword.value = '';
};

const startResetCodeCountdown = () => {
  resetCodeCountdown.value = 60;
  if (resetCodeTimer) {
    window.clearInterval(resetCodeTimer);
  }
  resetCodeTimer = window.setInterval(() => {
    resetCodeCountdown.value -= 1;
    if (resetCodeCountdown.value <= 0 && resetCodeTimer) {
      window.clearInterval(resetCodeTimer);
      resetCodeTimer = undefined;
    }
  }, 1000);
};

const toggleForgotPasswordPanel = () => {
  showForgotPasswordPanel.value = !showForgotPasswordPanel.value;
  errorMsg.value = '';
  resetCode.value = '';
  resetPassword.value = '';
  resetConfirmPassword.value = '';
};

const sendResetCode = async () => {
  const emailValue = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(emailValue)) {
    errorMsg.value = '请先输入正确的邮箱地址';
    return;
  }

  if (isSendingResetCode.value || resetCodeCountdown.value > 0) return;

  errorMsg.value = '';
  isSendingResetCode.value = true;
  try {
    const res: any = await request.post('/auth/password-reset/send-code', {
      email: emailValue,
    });

    if (res.code === 200) {
      startResetCodeCountdown();
      return;
    }

    errorMsg.value = res.message;
  } catch (err: any) {
    errorMsg.value = err.message || '验证码发送失败';
  } finally {
    isSendingResetCode.value = false;
  }
};

onMounted(() => {
  const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
  if (savedEmail) {
    email.value = savedEmail;
    rememberEmail.value = true;
  }
});

onBeforeUnmount(() => {
  if (resetCodeTimer) {
    window.clearInterval(resetCodeTimer);
  }
});
</script>

<template>
  <div
    v-if="show"
    class="auth-modal-overlay"
    :class="{ active: show }"
    @click.self="emit('close')"
  >
    <div class="auth-modal-panel">
      <button
        class="auth-modal-close"
        aria-label="关闭"
        @click="emit('close')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
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

      <div class="auth-logo-area">
        <div class="auth-logo-icon">
          灵
        </div>
        <h2 class="auth-welcome-title">
          欢迎来到灵策智算
        </h2>
        <p class="auth-welcome-subtitle">
          登录后即可使用 AI 员工、历史会话和群聊协作能力
        </p>
      </div>

      <div class="auth-tabs">
        <div
          class="auth-tab"
          :class="{ active: isLogin }"
          @click="switchMode(true)"
        >
          登录
        </div>
        <div
          class="auth-tab"
          :class="{ active: !isLogin }"
          @click="switchMode(false)"
        >
          注册
        </div>
      </div>

      <div class="auth-form-body">
        <div class="auth-form-group">
          <label for="auth-email">邮箱</label>
          <input
            id="auth-email"
            v-model="email"
            type="email"
            placeholder="请输入常用邮箱"
            autocomplete="email"
          >
        </div>

        <template v-if="showForgotPasswordPanel">
          <div class="auth-form-group">
            <label for="auth-reset-code">验证码</label>
            <div class="auth-code-row">
              <input
                id="auth-reset-code"
                v-model="resetCode"
                type="text"
                placeholder="请输入 6 位验证码"
                autocomplete="one-time-code"
              >
              <button
                type="button"
                class="auth-btn-code"
                :disabled="isSendingResetCode || resetCodeCountdown > 0"
                @click="sendResetCode"
              >
                {{ isSendingResetCode ? '发送中...' : (resetCodeCountdown > 0 ? `${resetCodeCountdown}s` : '发送验证码') }}
              </button>
            </div>
          </div>

          <div class="auth-form-group">
            <label for="auth-reset-password">新密码</label>
            <input
              id="auth-reset-password"
              v-model="resetPassword"
              type="password"
              placeholder="请输入新密码"
              autocomplete="new-password"
            >
          </div>

          <div class="auth-form-group">
            <label for="auth-reset-confirm-password">确认新密码</label>
            <input
              id="auth-reset-confirm-password"
              v-model="resetConfirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              autocomplete="new-password"
              @keydown.enter.prevent="handleSubmit"
            >
          </div>
        </template>

        <template v-else>
          <div
            v-if="!isLogin"
            class="auth-form-group"
          >
            <label for="auth-nickname">昵称</label>
            <input
              id="auth-nickname"
              v-model="nickname"
              type="text"
              placeholder="请输入您的昵称"
              autocomplete="nickname"
            >
          </div>

          <div class="auth-form-group">
            <label for="auth-password">密码</label>
            <div class="auth-password-field">
              <input
                id="auth-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                @keydown.enter.prevent="handleSubmit"
              >
              <button
                type="button"
                class="auth-password-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '隐藏' : '显示' }}
              </button>
            </div>
          </div>

          <div
            v-if="!isLogin"
            class="auth-form-group"
          >
            <label for="auth-confirm-password">确认密码</label>
            <input
              id="auth-confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              autocomplete="new-password"
              @keydown.enter.prevent="handleSubmit"
            >
          </div>
        </template>

        <div class="auth-remember-row">
          <label class="auth-checkbox-label">
            <input
              v-model="rememberEmail"
              type="checkbox"
            >
            <span>记住邮箱</span>
          </label>
          <button
            type="button"
            class="auth-link-button"
            @click="toggleForgotPasswordPanel"
          >
            {{ showForgotPasswordPanel ? '返回登录' : '忘记密码？' }}
          </button>
        </div>

        <div
          v-if="showForgotPasswordPanel"
          class="auth-helper-card"
        >
          <div class="auth-helper-title">
            找回密码
          </div>
          <div class="auth-helper-text">
            输入邮箱后发送验证码，收到邮件后即可直接重置密码。
          </div>
        </div>

        <button
          class="auth-btn-submit"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          {{ isSubmitting ? '提交中...' : (showForgotPasswordPanel ? '确认重置密码' : (isLogin ? '立即登录' : '注册并开始使用')) }}
        </button>

        <div
          v-if="errorMsg"
          class="auth-error-msg"
          style="display: block;"
        >
          {{ errorMsg }}
        </div>

        <div class="auth-switch-link">
          <span>{{ isLogin ? '还没有账号？' : '已经有账号？' }}</span>
          <a
            href="#"
            @click.prevent="switchMode(!isLogin)"
          >{{ isLogin ? '立即注册' : '去登录' }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
