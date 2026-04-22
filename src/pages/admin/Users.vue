<script setup lang="ts">
import { ref, onMounted } from 'vue';
import adminRequest from '../../utils/adminRequest';

const list = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const keyword = ref('');
const status = ref<number | null>(null);
const loading = ref(false);
const showEdit = ref(false);
const editingUser = ref<any>(null);
const editForm = ref({ status: 1, role: 'user', chat_limit: 50, paint_limit: 10 });
const editLoading = ref(false);
const editMsg = ref('');

const fetchUsers = async () => {
  loading.value = true;
  try {
    const params: any = { page: page.value, pageSize: pageSize.value };
    if (keyword.value) params.keyword = keyword.value;
    if (status.value !== null) params.status = status.value;
    const res = await adminRequest.get<any>('/api/admin/users', { params });
    if (res.data?.code === 200) {
      list.value = res.data.data.list;
      total.value = res.data.data.total;
    }
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const search = () => { page.value = 1; fetchUsers(); };
const reset = () => { keyword.value = ''; status.value = null; page.value = 1; fetchUsers(); };
const changePage = (p: number) => { page.value = p; fetchUsers(); };

const openEdit = (user: any) => {
  editingUser.value = user;
  editForm.value = {
    status: user.status,
    role: user.role,
    chat_limit: user.chat_limit ?? 50,
    paint_limit: user.paint_limit ?? 10,
  };
  editMsg.value = '';
  showEdit.value = true;
};

const saveEdit = async () => {
  editLoading.value = true;
  editMsg.value = '';
  try {
    const res = await adminRequest.put<any>(`/api/admin/users/${editingUser.value.id}`, editForm.value);
    if (res.data?.code === 200) {
      editMsg.value = '保存成功';
      setTimeout(() => { showEdit.value = false; fetchUsers(); }, 1000);
    } else {
      editMsg.value = res.data?.message || '保存失败';
    }
  } catch { editMsg.value = '保存失败'; }
  finally { editLoading.value = false; }
};

const deleteUser = async (id: number) => {
  if (!confirm('确认删除该用户？此操作不可恢复。')) return;
  try {
    const res = await adminRequest.delete<any>(`/api/admin/users/${id}`);
    if (res.data?.code === 200) fetchUsers();
    else alert(res.data?.message || '删除失败');
  } catch { alert('删除失败'); }
};

const toggleStatus = async (user: any) => {
  const newStatus = user.status === 1 ? 0 : 1;
  try {
    await adminRequest.put<any>(`/api/admin/users/${user.id}`, { status: newStatus });
    user.status = newStatus;
  } catch { alert('状态切换失败'); }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="users-page">
    <div class="toolbar">
      <input v-model="keyword" class="search-input" placeholder="搜索邮箱/昵称..." @keyup.enter="search" />
      <select v-model="status" class="status-select">
        <option :value="null">全部状态</option>
        <option :value="1">正常</option>
        <option :value="0">禁用</option>
      </select>
      <button class="btn-primary" @click="search">查询</button>
      <button class="btn-ghost" @click="reset">重置</button>
    </div>

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th><th>邮箱</th><th>昵称</th><th>角色</th><th>状态</th>
            <th>提问限额</th><th>注册时间</th><th>最后登录</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="9" class="loading">加载中...</td></tr>
          <tr v-else-if="!list.length"><td colspan="9" class="empty">暂无数据</td></tr>
          <tr v-for="user in list" v-else :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.nickname || '-' }}</td>
            <td><span class="role-badge">{{ user.role }}</span></td>
            <td>
              <span :class="['status-badge', user.status === 1 ? 'active' : 'banned']">
                {{ user.status === 1 ? '正常' : '禁用' }}
              </span>
            </td>
            <td>{{ user.chat_limit ?? '-' }}/{{ user.used_chats ?? 0 }}</td>
            <td>{{ user.created_at?.slice(0, 10) }}</td>
            <td>{{ user.last_login_at?.slice(0, 16) || '-' }}</td>
            <td>
              <div class="action-btns">
                <button class="btn-sm" @click="openEdit(user)">编辑</button>
                <button class="btn-sm" @click="toggleStatus(user)">
                  {{ user.status === 1 ? '禁用' : '启用' }}
                </button>
                <button class="btn-sm danger" @click="deleteUser(user.id)">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <span class="total">共 {{ total }} 条</span>
      <button class="btn-page" :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
      <span class="page-info">{{ page }} / {{ Math.ceil(total / pageSize) || 1 }}</span>
      <button class="btn-page" :disabled="page >= Math.ceil(total / pageSize)" @click="changePage(page + 1)">下一页</button>
    </div>

    <Teleport to="body">
      <div v-if="showEdit" class="modal-overlay" @click.self="showEdit = false">
        <div class="modal">
          <h3>编辑用户 #{{ editingUser?.id }}</h3>
          <div class="form-group">
            <label>状态</label>
            <select v-model="editForm.status">
              <option :value="1">正常</option>
              <option :value="0">禁用</option>
            </select>
          </div>
          <div class="form-group">
            <label>角色</label>
            <select v-model="editForm.role">
              <option value="user">普通用户</option>
              <option value="vip">VIP</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>每月提问上限</label>
              <input v-model.number="editForm.chat_limit" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>每月绘图上限</label>
              <input v-model.number="editForm.paint_limit" type="number" min="0" />
            </div>
          </div>
          <p v-if="editMsg" class="edit-msg" :class="{ success: editMsg.includes('成功') }">{{ editMsg }}</p>
          <div class="modal-actions">
            <button class="btn-ghost" @click="showEdit = false">取消</button>
            <button class="btn-primary" :disabled="editLoading" @click="saveEdit">
              {{ editLoading ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.users-page { display: flex; flex-direction: column; gap: 16px; }

.toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.search-input { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; min-width: 200px; outline: none; }
.status-select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; }
.btn-primary { padding: 8px 16px; background: #3b82f6; color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }
.btn-ghost { padding: 8px 16px; background: #fff; color: #374151; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; cursor: pointer; }
.btn-sm { padding: 4px 8px; background: #f1f5f9; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
.btn-sm.danger { background: #fef2f2; color: #ef4444; }
.action-btns { display: flex; gap: 4px; flex-wrap: wrap; }

.data-table-wrap { background: #fff; border-radius: 12px; overflow: auto; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 800px; }
.data-table th { text-align: left; padding: 12px 16px; color: #64748b; font-weight: 500; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
.data-table td { padding: 10px 16px; color: #374151; border-bottom: 1px solid #f8fafc; }
.data-table tr:last-child td { border-bottom: none; }
.role-badge { background: #eff6ff; color: #3b82f6; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
.status-badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
.status-badge.active { background: #f0fdf4; color: #22c55e; }
.status-badge.banned { background: #fef2f2; color: #ef4444; }
.loading, .empty { text-align: center; color: #94a3b8; padding: 32px; }

.pagination { display: flex; align-items: center; gap: 12px; }
.total { font-size: 13px; color: #64748b; }
.btn-page { padding: 6px 14px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; font-size: 13px; cursor: pointer; }
.btn-page:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 13px; color: #374151; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; border-radius: 16px; padding: 28px; width: 420px; max-width: 90vw; display: flex; flex-direction: column; gap: 16px; }
.modal h3 { font-size: 17px; font-weight: 600; color: #0f172a; margin: 0; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 500; color: #374151; }
.form-group input, .form-group select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.edit-msg { font-size: 13px; color: #ef4444; }
.edit-msg.success { color: #22c55e; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>
