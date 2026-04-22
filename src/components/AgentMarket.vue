<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChatStore } from '../stores/chat';
import { AI_EMPLOYEES, DEPARTMENTS } from '../data/employees';

const emit = defineEmits(['start-chat']);
const chatStore = useChatStore();

const searchQuery = ref('');
const activeDept = ref('all');
const isMultiSelect = ref(false);
const selectedIds = ref<string[]>([]);

const filteredEmployees = computed(() => {
  return AI_EMPLOYEES.filter(emp => {
    const matchDept = activeDept.value === 'all' || emp.dept === activeDept.value;
    const matchSearch = emp.name.includes(searchQuery.value) || 
                        emp.desc.includes(searchQuery.value) || 
                        emp.skills.some(s => s.includes(searchQuery.value));
    return matchDept && matchSearch;
  });
});

const handleSelect = (id: string) => {
  if (isMultiSelect.value) {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter(i => i !== id);
    } else if (selectedIds.value.length < 5) {
      selectedIds.value.push(id);
    } else {
      alert('最多只能选择5个AI员工');
    }
  } else {
    chatStore.selectEmployee(id);
    emit('start-chat');
  }
};

const startGroup = () => {
  if (selectedIds.value.length < 2) {
    alert('请至少选择2个AI员工');
    return;
  }
  const members = AI_EMPLOYEES.filter(e => selectedIds.value.includes(e.id));
  chatStore.startGroupChat(members);
  selectedIds.value = [];
  isMultiSelect.value = false;
  emit('start-chat');
};
</script>

<template>
  <div class="agent-market-container">
    <div
      class="ai-employee-header"
      style="border-bottom: none; padding: 0 0 20px 0;"
    >
      <div class="ai-employee-title-wrap">
        <h2 class="ai-employee-title">
          🤖 AI员工
        </h2>
        <p class="ai-employee-subtitle">
          选择一个专业AI员工，立即开始对话
        </p>
      </div>
    </div>
    
    <div
      class="ai-employee-search"
      style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px; padding: 0; border: none;"
    >
      <div
        class="search-input-wrap"
        style="flex: 1; position: relative;"
      >
        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--text-tertiary);"
        >
          <circle
            cx="11"
            cy="11"
            r="8"
          />
          <line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索员工名称或能力..."
          style="width: 100%; padding: 12px 16px 12px 42px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-primary); font-size: 15px; transition: all 0.3s ease;"
        >
      </div>
      <button 
        class="filter-btn" 
        :class="{ active: isMultiSelect }" 
        style="padding: 10px 20px; border-radius: 12px; white-space: nowrap; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-secondary); cursor: pointer; transition: all 0.3s ease;"
        @click="isMultiSelect = !isMultiSelect; selectedIds = []"
      >
        {{ isMultiSelect ? '取消多选' : '群聊多选' }}
      </button>
      <button 
        v-if="isMultiSelect"
        class="send-btn" 
        style="padding: 10px 20px; border-radius: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none; cursor: pointer; white-space: nowrap; font-weight: 500;"
        @click="startGroup"
      >
        开始群聊 ({{ selectedIds.length }}/5)
      </button>
    </div>
    
    <div
      class="ai-employee-filters"
      style="display: flex; gap: 10px; overflow-x: auto; padding: 0 0 10px 0; margin-bottom: 20px; border: none; scrollbar-width: none;"
    >
      <button
        class="filter-btn"
        :class="{ active: activeDept === 'all' }"
        @click="activeDept = 'all'"
      >
        全部部门
      </button>
      <button 
        v-for="dept in DEPARTMENTS" 
        :key="dept" 
        class="filter-btn" 
        :class="{ active: activeDept === dept }" 
        @click="activeDept = dept"
      >
        {{ dept }}
      </button>
    </div>
    
    <div
      class="ai-employee-grid"
      style="padding: 0; overflow-y: visible;"
    >
      <div 
        v-for="emp in filteredEmployees" 
        :key="emp.id" 
        class="employee-card" 
        :class="{ 
          active: (!isMultiSelect && chatStore.currentEmployee?.id === emp.id) || (isMultiSelect && selectedIds.includes(emp.id)) 
        }"
        :style="isMultiSelect && selectedIds.includes(emp.id) ? 'border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-light);' : ''"
        @click="handleSelect(emp.id)"
      >
        <div class="employee-card-header">
          <div
            class="employee-avatar"
            :class="emp.dept"
          >
            {{ emp.icon }}
          </div>
          <div class="employee-info">
            <div
              class="employee-dept-tag"
              :class="emp.dept"
            >
              {{ emp.dept }}
            </div>
            <div class="employee-name">
              {{ emp.name }}
            </div>
          </div>
        </div>
        <div class="employee-desc">
          {{ emp.desc }}
        </div>
        <div class="employee-card-footer">
          <div class="employee-skills">
            <span
              v-for="skill in emp.skills"
              :key="skill"
              class="skill-tag"
            >{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-market-container {
  padding: 20px 40px 60px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.search-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-light);
}
.filter-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}
</style>
