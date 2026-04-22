<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const currentStep = ref(0);
const isVisible = ref(false);

const steps = [
  {
    step: 1,
    title: '选择你的 AI 员工',
    description: '从上方列表中选择一位专属 AI 员工，每个员工都有不同的专业领域和能力',
    target: '[data-guide="agent-list"]',
    position: 'bottom',
  },
  {
    step: 2,
    title: '开始对话',
    description: '在下方输入框输入你的问题或需求，AI 员工会即时为你解答',
    target: '[data-guide="chat-input"]',
    position: 'top',
  },
  {
    step: 3,
    title: '收藏喜欢的内容',
    description: '点击消息右侧的收藏按钮，方便日后回顾',
    target: '[data-guide="chat-actions"]',
    position: 'left',
  },
  {
    step: 4,
    title: '探索更多 AI 员工',
    description: '不同的 AI 员工擅长不同领域，点击顶部「选择AI员工」自由切换',
    target: '[data-guide="agent-selector"]',
    position: 'bottom',
  },
];

const totalSteps = steps.length;

const show = () => { isVisible.value = true; currentStep.value = 0; };
const hide = () => { isVisible.value = false; };

const next = async () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++;
  } else {
    await finishOnboarding();
  }
};

const prev = () => {
  if (currentStep.value > 0) currentStep.value--;
};

const skip = async () => { await finishOnboarding(); };

const finishOnboarding = async () => {
  try {
    await authStore.completeOnboarding();
  } catch {}
  hide();
};

onMounted(async () => {
  const res = await authStore.fetchOnboardingStatus();
  if (res && !res.onboarded) {
    show();
  }
});

defineExpose({ show, hide });
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="onboarding-overlay">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${((currentStep + 1) / totalSteps) * 100}%` }"
          />
        </div>

        <div class="step-indicator">
          {{ currentStep + 1 }} / {{ totalSteps }}
        </div>

        <div class="guide-card" :class="`position-${steps[currentStep].position}`">
          <h3 class="guide-title">{{ steps[currentStep].title }}</h3>
          <p class="guide-desc">{{ steps[currentStep].description }}</p>

          <div class="guide-actions">
            <button v-if="currentStep > 0" class="btn-prev" @click="prev">上一步</button>
            <div class="dots">
              <span
                v-for="i in totalSteps"
                :key="i"
                class="dot"
                :class="{ active: i - 1 === currentStep }"
              />
            </div>
            <button class="btn-next" @click="next">
              {{ currentStep < totalSteps - 1 ? '下一步' : '完成引导' }}
            </button>
          </div>
          <button class="btn-skip" @click="skip">跳过引导</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px;
  gap: 12px;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.step-indicator {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.guide-card {
  background: #1e2130;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.guide-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
}

.guide-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 20px;
  line-height: 1.6;
}

.guide-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.2s;
}

.dot.active {
  background: #3b82f6;
  width: 18px;
  border-radius: 3px;
}

.btn-prev,
.btn-next {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-prev {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.btn-prev:hover { background: rgba(255, 255, 255, 0.15); }

.btn-next {
  background: #3b82f6;
  color: #fff;
}

.btn-next:hover { background: #2563eb; }

.btn-skip {
  display: block;
  margin: 12px auto 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
}

.btn-skip:hover { color: rgba(255, 255, 255, 0.7); }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
