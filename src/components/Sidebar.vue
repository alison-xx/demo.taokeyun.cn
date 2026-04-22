<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';

const authStore = useAuthStore();
const chatStore = useChatStore();

const emit = defineEmits(['openAuthModal', 'openSettings', 'closeSidebar']);

const createNewChat = () => {
  chatStore.currentSessionId = null;
  chatStore.currentEmployee = null;
  chatStore.currentMessages = [];
  emit('closeSidebar');
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L17.4 9H22L14.8 14.6L17.4 22L12 17.4L6.6 22L9.2 14.6L2 9H6.6L12 2Z"
              fill="url(#logo-gradient)"
            />
            <defs>
              <linearGradient
                id="logo-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stop-color="#7B61FF"
                />
                <stop
                  offset="100%"
                  stop-color="#00A1D6"
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">灵策智算</span>
      </div>
      
      <button
        class="ai-employee-btn"
        data-guide="agent-selector"
        @click="createNewChat"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle
            cx="9"
            cy="7"
            r="4"
          />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        选择AI员工
        <span class="pulse-dot" />
      </button>
      
      <button
        class="new-chat-btn"
        @click="createNewChat"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line
            x1="12"
            y1="5"
            x2="12"
            y2="19"
          />
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
          />
        </svg>
        新建对话
      </button>
    </div>

    <div
      v-if="chatStore.currentEmployee"
      class="current-employee-bar"
      @click="createNewChat"
    >
      <div class="current-employee-info">
        <div class="current-employee-avatar">
          {{ chatStore.currentEmployee.icon || '灵' }}
        </div>
        <div class="current-employee-details">
          <div class="current-employee-name">
            {{ chatStore.currentEmployee.name }}
          </div>
          <div class="current-employee-dept">
            {{ chatStore.currentEmployee.dept }}
          </div>
        </div>
        <div class="current-employee-arrow">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>

    <div class="history-section">
      <div class="history-label">
        历史记录
      </div>
      <div class="history-list">
        <div 
          v-for="session in chatStore.sessions" 
          :key="session.id" 
          class="history-item"
          :class="{ active: chatStore.currentSessionId === session.id }"
          @click="chatStore.loadMessages(session.id); emit('closeSidebar')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span class="history-title">{{ session.title || '新对话' }}</span>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div
        class="user-profile"
        @click="!authStore.user && emit('openAuthModal')"
      >
        <div class="user-avatar">
          {{ authStore.user ? authStore.user.username.charAt(0) : '未' }}
        </div>
        <div class="user-info">
          <div class="user-name">
            {{ authStore.user ? authStore.user.username : '未登录用户' }}
          </div>
          <div class="user-status">
            <span class="status-dot" />
            <span>{{ authStore.user ? '在线' : '点击登录' }}</span>
          </div>
        </div>
        <div
          v-if="authStore.user"
          class="user-settings"
          @click.stop="emit('openSettings')"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle
              cx="12"
              cy="12"
              r="3"
            />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </div>
        <div
          v-else
          class="user-auth-btn"
          title="登录"
          @click.stop="emit('openAuthModal')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line
              x1="15"
              y1="12"
              x2="3"
              y2="12"
            />
          </svg>
        </div>
        <div
          v-if="authStore.user"
          class="user-logout"
          title="退出登录"
          @click.stop="authStore.logout()"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
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
        </div>
      </div>
    </div>
  </aside>
</template>
