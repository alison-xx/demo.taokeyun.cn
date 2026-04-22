import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AI_EMPLOYEES, type AIEmployee } from '../data/employees';
import request from '../utils/request';

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export const useChatStore = defineStore('chat', () => {
  const currentEmployee = ref<AIEmployee | null>(AI_EMPLOYEES[0]);
  const isGroupChat = ref(false);
  const selectedGroupMembers = ref<AIEmployee[]>([]);
  const sessions = ref<any[]>([]);
  const currentSessionId = ref<number | null>(null);
  const currentMessages = ref<ChatMessage[]>([]);

  const selectEmployee = (id: string) => {
    const employee = AI_EMPLOYEES.find(e => e.id === id);
    if (employee) {
      currentEmployee.value = employee;
      isGroupChat.value = false;
      selectedGroupMembers.value = [];
      currentSessionId.value = null;
      currentMessages.value = [];
    }
  };

  const startGroupChat = (members: AIEmployee[]) => {
    if (members.length > 0) {
      isGroupChat.value = true;
      selectedGroupMembers.value = members;
      currentEmployee.value = {
        id: 'group-chat',
        name: 'AI 专家团',
        dept: '协作',
        icon: '👥',
        desc: '多个 AI 专家为您提供多角度的建议和方案',
        skills: ['多角度分析', '综合方案', '头脑风暴'],
        systemPrompt: ''
      };
      currentSessionId.value = null;
      currentMessages.value = [];
    }
  };

  const loadSessions = async () => {
    try {
      const res: any = await request.get('/chat/sessions');
      sessions.value = res.data.list;
    } catch (e) {
      console.error(e);
    }
  };

  const loadMessages = async (sessionId: number) => {
    try {
      const res: any = await request.get(`/chat/messages?session_id=${sessionId}`);
      currentSessionId.value = sessionId;
      currentMessages.value = res.data.messages;
      
      const session = res.data.session;
      if (session.collaboration_mode) {
        isGroupChat.value = true;
        const selectedIds = typeof session.selected_employees === 'string' ? JSON.parse(session.selected_employees) : session.selected_employees;
        selectedGroupMembers.value = AI_EMPLOYEES.filter(e => selectedIds?.includes(e.id));
        currentEmployee.value = {
          id: 'group-chat',
          name: 'AI 专家团',
          dept: '协作',
          icon: '👥',
          desc: '多个 AI 专家为您提供多角度的建议和方案',
          skills: ['多角度分析', '综合方案', '头脑风暴'],
          systemPrompt: ''
        };
      } else {
        isGroupChat.value = false;
        selectedGroupMembers.value = [];
        const emp = AI_EMPLOYEES.find(e => e.id === session.employee_id);
        if (emp) currentEmployee.value = emp;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createSession = async () => {
    if (!currentEmployee.value) return null;
    try {
      const res: any = await request.post('/chat/session/create', {
        employee_id: currentEmployee.value.id,
        employee_name: currentEmployee.value.name,
        collaboration_mode: isGroupChat.value,
        selected_employees: isGroupChat.value ? selectedGroupMembers.value.map(m => m.id) : null
      });
      currentSessionId.value = res.data.session_id;
      currentMessages.value = [];
      await loadSessions();
      return res.data.session_id;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return {
    currentEmployee,
    isGroupChat,
    selectedGroupMembers,
    sessions,
    currentSessionId,
    currentMessages,
    selectEmployee,
    startGroupChat,
    loadSessions,
    loadMessages,
    createSession
  };
});