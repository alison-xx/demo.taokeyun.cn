<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import AgentMarket from '../components/AgentMarket.vue';
import AuthModal from '../components/AuthModal.vue';
import SettingsModal from '../components/SettingsModal.vue';
import MarkdownMessage from '../components/MarkdownMessage.vue';
import { useChatStore } from '../stores/chat';
import { useAuthStore } from '../stores/auth';

const chatStore = useChatStore();
const authStore = useAuthStore();

const showAuthModal = ref(false);
const showSettingsModal = ref(false);
const isSidebarOpen = ref(false);

const openAuthModal = () => showAuthModal.value = true;
const openSettingsModal = () => showSettingsModal.value = true;
const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : '');
const handleAuthRequired = () => {
  showAuthModal.value = true;
};

const currentInput = ref('');
const isGenerating = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  const content = currentInput.value.trim();
  if (!content || isGenerating.value) return;

  if (!authStore.accessToken) {
    showAuthModal.value = true;
    return;
  }

  currentInput.value = '';
  isGenerating.value = true;

  if (!chatStore.currentSessionId) {
    const newSessionId = await chatStore.createSession();
    if (!newSessionId) {
      isGenerating.value = false;
      return;
    }
  }

  chatStore.currentMessages.push({ role: 'user', content });
  scrollToBottom();

  const assistantMessage = { role: 'assistant', content: '' } as any;
  chatStore.currentMessages.push(assistantMessage);

  try {
    const response = await fetch(`${apiBaseURL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({
        session_id: chatStore.currentSessionId,
        content,
        model: 'deepseek'
      })
    });

    if (!response.ok) throw new Error('Stream failed');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (!dataStr) continue;
          try {
            const data = JSON.parse(dataStr);
            if (data.token) {
              assistantMessage.content += data.token;
              scrollToBottom();
            }
            if (data.done) {
              isGenerating.value = false;
            }
            if (data.error) {
              console.error('API Error:', data.error);
            }
          } catch (e) {}
        }
      }
    }
  } catch (error) {
    console.error('Send message error:', error);
    assistantMessage.content = '抱歉，服务出现异常，请稍后重试。';
  } finally {
    isGenerating.value = false;
    chatStore.loadSessions();
  }
};

onMounted(() => {
  window.addEventListener('auth-required', handleAuthRequired);
  if (authStore.accessToken) {
    chatStore.loadSessions();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('auth-required', handleAuthRequired);
});
</script>

<template>
  <div class="app-container">
    <div class="bg-decoration">
      <div class="bg-orb bg-orb-1" />
      <div class="bg-orb bg-orb-2" />
      <div class="bg-orb bg-orb-3" />
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div 
      class="sidebar-overlay" 
      :class="{ active: isSidebarOpen }" 
      @click="isSidebarOpen = false"
    />

    <Sidebar 
      :class="{ open: isSidebarOpen }"
      @open-auth-modal="openAuthModal"
      @open-settings="openSettingsModal"
      @close-sidebar="isSidebarOpen = false"
    />

    <main class="main-content">
      <template v-if="!chatStore.currentEmployee && chatStore.currentMessages.length === 0">
        <div
          class="chat-header mobile-only"
          style="padding: 16px; border-bottom: 1px solid var(--border-color);"
        >
          <button
            class="mobile-menu-btn"
            @click.stop="toggleSidebar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line
                x1="3"
                y1="12"
                x2="21"
                y2="12"
              />
              <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
              />
              <line
                x1="3"
                y1="18"
                x2="21"
                y2="18"
              />
            </svg>
          </button>
          <button
            v-if="!authStore.user"
            class="header-login-btn"
            @click="openAuthModal"
          >
            登录 / 注册
          </button>
        </div>
        <AgentMarket @start-chat="isSidebarOpen = false" data-guide="agent-list" />
      </template>
      <template v-else>
        <header class="chat-header">
          <div class="chat-header-left">
            <button
              class="mobile-menu-btn"
              @click.stop="toggleSidebar"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                />
                <line
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                />
                <line
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                />
              </svg>
            </button>
            <h1 class="header-title">
              {{ chatStore.currentEmployee ? chatStore.currentEmployee.name : '新对话' }}
            </h1>
          </div>
          <div class="chat-header-right">
            <button
              v-if="!authStore.user"
              class="header-login-btn"
              @click="openAuthModal"
            >
              登录 / 注册
            </button>
          </div>
        </header>

        <div
          ref="messagesContainer"
          class="chat-messages"
          style="overflow-y: auto; padding: 20px;"
        >
          <div
            v-if="chatStore.currentMessages.length === 0 && chatStore.currentEmployee"
            class="welcome-container"
          >
            <h2 class="welcome-title">
              我是{{ chatStore.currentEmployee.name }}
            </h2>
            <p class="welcome-subtitle">
              {{ chatStore.currentEmployee.desc }}
            </p>
          </div>

          <div
            v-for="(msg, index) in chatStore.currentMessages"
            :key="index"
            :class="['message', msg.role === 'user' ? 'message-user' : 'message-ai']"
          >
            <div class="message-avatar">
              {{ msg.role === 'user' ? (authStore.user?.username?.charAt(0) || '我') : (chatStore.currentEmployee?.icon || 'AI') }}
            </div>
            <div class="message-content" data-guide="chat-actions">
              <div
                v-if="msg.role === 'user'"
                class="message-bubble"
                style="white-space: pre-wrap;"
              >
                {{ msg.content }}
              </div>
              <div
                v-else
                class="message-bubble"
              >
                <MarkdownMessage :content="msg.content" />
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-container">
          <div class="input-wrapper">
            <textarea
              v-model="currentInput"
              class="chat-input"
              placeholder="选择AI员工后，开始您的专属对话..."
              rows="1"
              :disabled="isGenerating"
              data-guide="chat-input"
              @keydown.enter.prevent="sendMessage"
            />
            <div class="input-actions">
              <button
                class="send-btn"
                :disabled="isGenerating || !currentInput.trim()"
                @click="sendMessage"
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
                    x1="22"
                    y1="2"
                    x2="11"
                    y2="13"
                  />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </template>
    </main>

    <AuthModal
      :show="showAuthModal"
      @close="showAuthModal = false"
    />

    <SettingsModal
      :show="showSettingsModal"
      @close="showSettingsModal = false"
    />
  </div>
</template>
