<script setup lang="ts">
import { ref, onMounted } from 'vue';
import adminRequest from '../../utils/adminRequest';

const list = ref<any[]>([]);
const loading = ref(false);
const showModal = ref(false);
const isEdit = ref(false);
const editingAgent = ref<any>(null);
const form = ref({ id: '', name: '', icon: '', dept: '', description: '', system_prompt: '', tags: '', skills: '', model: 'deepseek', max_tokens: 4096, temperature: 0.7, top_p: 0.9, price_range: 'free', is_active: 1, is_recommended: 0, sort_order: 0 });
const saveLoading = ref(false);
const saveMsg = ref('');

const defaultForm = () => ({ id: '', name: '', icon: '', dept: '', description: '', system_prompt: '', tags: '', skills: '', model: 'deepseek', max_tokens: 4096, temperature: 0.7, top_p: 0.9, price_range: 'free', is_active: 1, is_recommended: 0, sort_order: 0 });

const fetchAgents = async () => {
  loading.value = true;
  try {
    const res = await adminRequest.get<any>('/api/admin/agents');
    if (res.data?.code === 200) list.value = res.data.data || [];
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const openCreate = () => {
  form.value = defaultForm();
  isEdit.value = false;
  saveMsg.value = '';
  showModal.value = true;
};

const openEdit = (agent: any) => {
  editingAgent.value = agent;
  form.value = {
    id: agent.id, name: agent.name, icon: agent.icon || '', dept: agent.dept || '',
    description: agent.description || '', system_prompt: agent.system_prompt || '',
    tags: Array.isArray(agent.tags) ? agent.tags.join(',') : (agent.tags || ''),
    skills: Array.isArray(agent.skills) ? agent.skills.join(',') : (agent.skills || ''),
    model: agent.model || 'deepseek', max_tokens: agent.max_tokens || 4096,
    temperature: agent.temperature ?? 0.7, top_p: agent.top_p ?? 0.9,
    price_range: agent.price_range || 'free', is_active: agent.is_active ? 1 : 0,
    is_recommended: agent.is_recommended ? 1 : 0, sort_order: agent.sort_order || 0,
  };
  isEdit.value = true;
  saveMsg.value = '';
  showModal.value = true;
};

const saveAgent = async () => {
  if (!form.value.id || !form.value.name) { saveMsg.value = 'ID和名称必填'; return; }
  saveLoading.value = true;
  saveMsg.value = '';
  const payload = {
    ...form.value,
    tags: form.value.tags.split(',').map(t => t.trim()).filter(Boolean),
    skills: form.value.skills.split(',').map(t => t.trim()).filter(Boolean),
    is_active: form.value.is_active ? 1 : 0,
    is_recommended: form.value.is_recommended ? 1 : 0,
  };
  try {
    const url = isEdit.value ? `/api/admin/agents/${form.value.id}` : '/api/admin/agents';
    const method = isEdit.value ? adminRequest.put : adminRequest.post;
    const res = await method<any>(url, payload);
    if (res.data?.code === 200) {
      saveMsg.value = isEdit.value ? '更新成功' : '创建成功';
      setTimeout(() => { showModal.value = false; fetchAgents(); }, 1200);
    } else {
      saveMsg.value = res.data?.message || '操作失败';
    }
  } catch { saveMsg.value = '操作失败'; }
  finally { saveLoading.value = false; }
};

const deleteAgent = async (id: string) => {
  if (!confirm(`确认删除 AI 员工「${id}」？`)) return;
  try {
    const res = await adminRequest.delete<any>(`/api/admin/agents/${id}`);
    if (res.data?.code === 200) fetchAgents();
    else alert(res.data?.message || '删除失败');
  } catch { alert('删除失败'); }
};

const cloneAgent = async (id: string) => {
  try {
    const res = await adminRequest.post<any>(`/api/admin/agents/${id}/clone`);
    if (res.data?.code === 200) { alert(`克隆成功，新ID: ${res.data.data.newId}`); fetchAgents(); }
    else alert(res.data?.message || '克隆失败');
  } catch { alert('克隆失败'); }
};

const toggleActive = async (agent: any) => {
  try {
    await adminRequest.put<any>(`/api/admin/agents/${agent.id}`, { is_active: agent.is_active ? 0 : 1 });
    agent.is_active = agent.is_active ? 0 : 1;
  } catch { alert('切换失败'); }
};

onMounted(fetchAgents);
</script>

<template>
  <div class="agents-page">
    <div class="toolbar">
      <h2 class="page-title">AI员工管理</h2>
      <button class="btn-primary" @click="openCreate">+ 新建员工</button>
    </div>

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>名称</th><th>部门</th><th>模型</th><th>价格</th><th>推荐</th><th>状态</th><th>排序</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="9" class="loading">加载中...</td></tr>
          <tr v-else-if="!list.length"><td colspan="9" class="empty">暂无数据</td></tr>
          <tr v-for="agent in list" v-else :key="agent.id">
            <td><code>{{ agent.id }}</code></td>
            <td><span class="agent-icon">{{ agent.icon }}</span> {{ agent.name }}</td>
            <td>{{ agent.dept || '-' }}</td>
            <td>{{ agent.model }}</td>
            <td><span class="price-badge">{{ agent.price_range }}</span></td>
            <td>{{ agent.is_recommended ? '✅' : '—' }}</td>
            <td>
              <span :class="['status-badge', agent.is_active ? 'active' : 'inactive']">
                {{ agent.is_active ? '启用' : '禁用' }}
              </span>
            </td>
            <td>{{ agent.sort_order }}</td>
            <td>
              <div class="action-btns">
                <button class="btn-sm" @click="openEdit(agent)">编辑</button>
                <button class="btn-sm" @click="cloneAgent(agent.id)">克隆</button>
                <button class="btn-sm" @click="toggleActive(agent)">{{ agent.is_active ? '禁用' : '启用' }}</button>
                <button class="btn-sm danger" @click="deleteAgent(agent.id)">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal modal-lg">
          <h3>{{ isEdit ? '编辑员工' : '新建员工' }}</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>ID（英文唯一标识）</label>
              <input v-model="form.id" :disabled="isEdit" placeholder="如: bilibili-strategist" />
            </div>
            <div class="form-group">
              <label>名称</label>
              <input v-model="form.name" placeholder="如: B站内容策略师" />
            </div>
            <div class="form-group">
              <label>图标（emoji）</label>
              <input v-model="form.icon" placeholder="如: 📺" />
            </div>
            <div class="form-group">
              <label>部门</label>
              <input v-model="form.dept" placeholder="如: 内容运营" />
            </div>
            <div class="form-group">
              <label>模型</label>
              <select v-model="form.model">
                <option value="deepseek">DeepSeek</option>
                <option value="gpt-4">GPT-4</option>
                <option value="minimax">MiniMax</option>
              </select>
            </div>
            <div class="form-group">
              <label>价格区间</label>
              <select v-model="form.price_range">
                <option value="free">免费</option>
                <option value="low">低价</option>
                <option value="medium">中等</option>
                <option value="high">高价</option>
              </select>
            </div>
            <div class="form-group">
              <label>最大Token</label>
              <input v-model.number="form.max_tokens" type="number" />
            </div>
            <div class="form-group">
              <label>排序权重</label>
              <input v-model.number="form.sort_order" type="number" />
            </div>
            <div class="form-group">
              <label>Temperature</label>
              <input v-model.number="form.temperature" type="number" step="0.1" min="0" max="2" />
            </div>
            <div class="form-group">
              <label>Top-P</label>
              <input v-model.number="form.top_p" type="number" step="0.05" min="0" max="1" />
            </div>
            <div class="form-group form-check">
              <label><input v-model="form.is_active" type="checkbox" :true-value="1" :false-value="0" /> 启用</label>
            </div>
            <div class="form-group form-check">
              <label><input v-model="form.is_recommended" type="checkbox" :true-value="1" :false-value="0" /> 首页推荐</label>
            </div>
          </div>
          <div class="form-group">
            <label>描述</label>
            <input v-model="form.description" placeholder="简短描述" />
          </div>
          <div class="form-group">
            <label>标签（逗号分隔）</label>
            <input v-model="form.tags" placeholder="如: 行业:B站内容,语言:中文,风格:专业" />
          </div>
          <div class="form-group">
            <label>技能（逗号分隔）</label>
            <input v-model="form.skills" placeholder="如: 视频数据分析,标题文案优化" />
          </div>
          <div class="form-group">
            <label>系统提示词</label>
            <textarea v-model="form.system_prompt" rows="4" placeholder="设定AI员工的专业角色和行为..." />
          </div>
          <p v-if="saveMsg" class="save-msg" :class="{ success: saveMsg.includes('成功') }">{{ saveMsg }}</p>
          <div class="modal-actions">
            <button class="btn-ghost" @click="showModal = false">取消</button>
            <button class="btn-primary" :disabled="saveLoading" @click="saveAgent">
              {{ saveLoading ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.agents-page { display: flex; flex-direction: column; gap: 16px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0; }
.btn-primary { padding: 8px 16px; background: #3b82f6; color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }
.btn-ghost { padding: 8px 16px; background: #fff; color: #374151; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; cursor: pointer; }
.btn-sm { padding: 4px 8px; background: #f1f5f9; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
.btn-sm.danger { background: #fef2f2; color: #ef4444; }
.action-btns { display: flex; gap: 4px; flex-wrap: wrap; }

.data-table-wrap { background: #fff; border-radius: 12px; overflow: auto; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 900px; }
.data-table th { text-align: left; padding: 12px 16px; color: #64748b; font-weight: 500; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
.data-table td { padding: 10px 16px; color: #374151; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.agent-icon { font-size: 18px; }
.price-badge { background: #f0fdf4; color: #22c55e; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
.status-badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
.status-badge.active { background: #f0fdf4; color: #22c55e; }
.status-badge.inactive { background: #fef2f2; color: #94a3b8; }
.loading, .empty { text-align: center; color: #94a3b8; padding: 32px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 9999; display: flex; align-items: center; justify-content: center; overflow-y: auto; padding: 20px; }
.modal { background: #fff; border-radius: 16px; padding: 28px; width: 560px; max-width: 100%; display: flex; flex-direction: column; gap: 16px; }
.modal-lg { width: 700px; }
.modal h3 { font-size: 17px; font-weight: 600; color: #0f172a; margin: 0; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 500; color: #374151; }
.form-group input, .form-group select, .form-group textarea { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; }
.form-group textarea { resize: vertical; }
.form-check label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; }
.form-check input[type="checkbox"] { width: auto; }
.save-msg { font-size: 13px; color: #ef4444; }
.save-msg.success { color: #22c55e; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>
