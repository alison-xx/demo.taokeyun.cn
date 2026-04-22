<script setup lang="ts">
import { ref, onMounted } from 'vue';
import adminRequest from '../../utils/adminRequest';

// ── Moderation ──────────────────────────────────────────────
const modQueue = ref<any[]>([]);
const modLoading = ref(false);
const modStatus = ref('pending');

const fetchMod = async () => {
  modLoading.value = true;
  try {
    const res = await adminRequest.get<any>('/api/admin/system/moderation/queue', { params: { status: modStatus.value } });
    if (res.data?.code === 200) modQueue.value = res.data.data || [];
  } catch (e) { console.error(e); }
  finally { modLoading.value = false; }
};

const batchAction = async (action: 'approved' | 'rejected' | 'ignored') => {
  const selected = modQueue.value.filter((_: any, i: number) => (document.getElementById(`mod-check-${i}`) as HTMLInputElement)?.checked);
  if (!selected.length) { alert('请先选择要审核的内容'); return; }
  const ids = selected.map((s: any) => s.id);
  try {
    await adminRequest.post<any>('/api/admin/system/moderation/batch', { ids, action });
    fetchMod();
  } catch { alert('操作失败'); }
};

// ── Sensitive Words ──────────────────────────────────────
const swList = ref<any[]>([]);
const swLoading = ref(false);
const showSwAdd = ref(false);
const swForm = ref({ word: '', level: 'normal', replace_to: '*' });
const swAdding = ref(false);

const fetchSw = async () => {
  swLoading.value = true;
  try {
    const res = await adminRequest.get<any>('/api/admin/system/sensitive-words');
    if (res.data?.code === 200) swList.value = res.data.data || [];
  } catch (e) { console.error(e); }
  finally { swLoading.value = false; }
};

const addSw = async () => {
  if (!swForm.value.word) return;
  swAdding.value = true;
  try {
    await adminRequest.post<any>('/api/admin/system/sensitive-words', swForm.value);
    showSwAdd.value = false; swForm.value = { word: '', level: 'normal', replace_to: '*' };
    fetchSw();
  } catch { alert('添加失败'); }
  finally { swAdding.value = false; }
};

const deleteSw = async (id: number) => {
  if (!confirm('确认删除？')) return;
  try {
    await adminRequest.delete<any>(`/api/admin/system/sensitive-words/${id}`);
    fetchSw();
  } catch { alert('删除失败'); }
};

// ── Announcements ────────────────────────────────────────
const annList = ref<any[]>([]);
const annLoading = ref(false);
const showAnnAdd = ref(false);
const annForm = ref({ title: '', content_md: '', content_html: '', type: 'notice', is_popup: 0, is_active: 1 });
const annAdding = ref(false);

const fetchAnn = async () => {
  annLoading.value = true;
  try {
    const res = await adminRequest.get<any>('/api/admin/system/announcements');
    if (res.data?.code === 200) annList.value = res.data.data || [];
  } catch (e) { console.error(e); }
  finally { annLoading.value = false; }
};

const addAnn = async () => {
  if (!annForm.value.title) return;
  annAdding.value = true;
  try {
    await adminRequest.post<any>('/api/admin/system/announcements', annForm.value);
    showAnnAdd.value = false; annForm.value = { title: '', content_md: '', content_html: '', type: 'notice', is_popup: 0, is_active: 1 };
    fetchAnn();
  } catch { alert('添加失败'); }
  finally { annAdding.value = false; }
};

// ── Logs ─────────────────────────────────────────────────
const logs = ref<any[]>([]);
const logTotal = ref(0);
const logPage = ref(1);
const logLoading = ref(false);

const fetchLogs = async () => {
  logLoading.value = true;
  try {
    const res = await adminRequest.get<any>('/api/admin/system/logs', { params: { page: logPage.value, pageSize: 20 } });
    if (res.data?.code === 200) {
      logs.value = res.data.data.list || [];
      logTotal.value = res.data.data.total || 0;
    }
  } catch (e) { console.error(e); }
  finally { logLoading.value = false; }
};

onMounted(() => { fetchMod(); fetchSw(); fetchAnn(); fetchLogs(); });
</script>

<template>
  <div class="system-page">

    <!-- ── 内容审核 ─────────────────────────────────── -->
    <section class="section">
      <div class="section-header">
        <h2>🛡️ 内容审核</h2>
        <div class="section-actions">
          <select v-model="modStatus" @change="fetchMod" class="filter-select">
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
            <option value="ignored">已忽略</option>
          </select>
          <button class="btn-success btn-sm" @click="batchAction('approved')">✅ 批量通过</button>
          <button class="btn-danger btn-sm" @click="batchAction('rejected')">❌ 批量拒绝</button>
        </div>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th style="width:40px"></th><th>ID</th><th>用户邮箱</th><th>会话</th><th>内容摘要</th><th>状态</th><th>时间</th></tr></thead>
          <tbody>
            <tr v-if="modLoading"><td colspan="7" class="loading">加载中...</td></tr>
            <tr v-else-if="!modQueue.length"><td colspan="7" class="empty">暂无数据</td></tr>
            <tr v-for="(item, idx) in modQueue" v-else :key="item.id">
              <td><input :id="`mod-check-${idx}`" type="checkbox" /></td>
              <td>{{ item.id }}</td>
              <td>{{ item.user_email }}</td>
              <td>{{ item.session_title || '-' }}</td>
              <td class="content-preview">{{ (item.content || '').slice(0, 60) }}...</td>
              <td><span :class="['status-badge', item.status]">{{ item.status }}</span></td>
              <td>{{ item.created_at?.slice(0, 16) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ── 敏感词管理 ──────────────────────────────── -->
    <section class="section">
      <div class="section-header">
        <h2>⚠️ 敏感词管理</h2>
        <button class="btn-primary btn-sm" @click="showSwAdd = true">+ 添加敏感词</button>
      </div>
      <div class="tag-list">
        <div v-if="swLoading" class="loading">加载中...</div>
        <div v-else-if="!swList.length" class="empty">暂无敏感词</div>
        <div v-else v-for="sw in swList" :key="sw.id" class="sw-tag" :class="`level-${sw.level}`">
          <span>{{ sw.word }}</span>
          <button class="del-btn" @click="deleteSw(sw.id)">×</button>
        </div>
      </div>
      <Teleport to="body">
        <div v-if="showSwAdd" class="modal-overlay" @click.self="showSwAdd = false">
          <div class="modal">
            <h3>添加敏感词</h3>
            <div class="form-group"><label>敏感词</label><input v-model="swForm.word" /></div>
            <div class="form-row">
              <div class="form-group"><label>级别</label><select v-model="swForm.level"><option value="strict">严格</option><option value="normal">普通</option><option value="loose">宽松</option></select></div>
              <div class="form-group"><label>替换为</label><input v-model="swForm.replace_to" /></div>
            </div>
            <div class="modal-actions">
              <button class="btn-ghost" @click="showSwAdd = false">取消</button>
              <button class="btn-primary" :disabled="swAdding" @click="addSw">{{ swAdding ? '添加中...' : '添加' }}</button>
            </div>
          </div>
        </div>
      </Teleport>
    </section>

    <!-- ── 公告管理 ───────────────────────────────── -->
    <section class="section">
      <div class="section-header">
        <h2>📢 公告管理</h2>
        <button class="btn-primary btn-sm" @click="showAnnAdd = true">+ 新建公告</button>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>标题</th><th>类型</th><th>弹窗</th><th>状态</th><th>发布时间</th></tr></thead>
          <tbody>
            <tr v-if="annLoading"><td colspan="5" class="loading">加载中...</td></tr>
            <tr v-else-if="!annList.length"><td colspan="5" class="empty">暂无公告</td></tr>
            <tr v-else v-for="a in annList" :key="a.id">
              <td>{{ a.title }}</td>
              <td>{{ a.type }}</td>
              <td>{{ a.is_popup ? '✅' : '—' }}</td>
              <td><span :class="['status-badge', a.is_active ? 'approved' : 'rejected']">{{ a.is_active ? '上线' : '下线' }}</span></td>
              <td>{{ a.published_at?.slice(0, 16) || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Teleport to="body">
        <div v-if="showAnnAdd" class="modal-overlay" @click.self="showAnnAdd = false">
          <div class="modal">
            <h3>新建公告</h3>
            <div class="form-group"><label>标题</label><input v-model="annForm.title" /></div>
            <div class="form-row">
              <div class="form-group"><label>类型</label><select v-model="annForm.type"><option value="notice">通知</option><option value="update">更新</option><option value="maintenance">维护</option></select></div>
              <div class="form-group form-check"><label><input v-model="annForm.is_popup" type="checkbox" :true-value="1" :false-value="0" /> 登录后弹窗</label></div>
            </div>
            <div class="form-group"><label>内容 (Markdown)</label><textarea v-model="annForm.content_md" rows="4" /></div>
            <div class="modal-actions">
              <button class="btn-ghost" @click="showAnnAdd = false">取消</button>
              <button class="btn-primary" :disabled="annAdding" @click="addAnn">{{ annAdding ? '发布中...' : '发布' }}</button>
            </div>
          </div>
        </div>
      </Teleport>
    </section>

    <!-- ── 操作日志 ───────────────────────────────── -->
    <section class="section">
      <div class="section-header">
        <h2>📋 操作日志</h2>
        <button class="btn-ghost btn-sm" @click="logPage = 1; fetchLogs()">🔄 刷新</button>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>管理员</th><th>操作</th><th>对象类型</th><th>对象ID</th><th>IP</th><th>时间</th></tr></thead>
          <tbody>
            <tr v-if="logLoading"><td colspan="6" class="loading">加载中...</td></tr>
            <tr v-else-if="!logs.length"><td colspan="6" class="empty">暂无日志</td></tr>
            <tr v-else v-for="log in logs" :key="log.id">
              <td>{{ log.admin_name }}</td>
              <td><code>{{ log.action }}</code></td>
              <td>{{ log.target_type || '-' }}</td>
              <td>{{ log.target_id || '-' }}</td>
              <td>{{ log.ip || '-' }}</td>
              <td>{{ log.created_at?.slice(0, 16) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span>共 {{ logTotal }} 条</span>
        <button class="btn-page" :disabled="logPage <= 1" @click="logPage--; fetchLogs()">上一页</button>
        <span>{{ logPage }}</span>
        <button class="btn-page" @click="logPage++; fetchLogs()">下一页</button>
      </div>
    </section>

  </div>
</template>

<style scoped>
.system-page { display: flex; flex-direction: column; gap: 32px; }
.section { display: flex; flex-direction: column; gap: 16px; }
.section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.section-header h2 { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0; }
.section-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.btn-primary { padding: 8px 16px; background: #3b82f6; color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }
.btn-ghost { padding: 8px 16px; background: #fff; color: #374151; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; cursor: pointer; }
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-success { background: #f0fdf4; color: #22c55e; border: none; border-radius: 6px; cursor: pointer; }
.btn-danger { background: #fef2f2; color: #ef4444; border: none; border-radius: 6px; cursor: pointer; }
.filter-select { padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; }

.data-table-wrap { background: #fff; border-radius: 12px; overflow: auto; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 600px; }
.data-table th { text-align: left; padding: 10px 14px; color: #64748b; font-weight: 500; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
.data-table td { padding: 10px 14px; color: #374151; border-bottom: 1px solid #f8fafc; }
.data-table tr:last-child td { border-bottom: none; }
.content-preview { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.status-badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; background: #f1f5f9; color: #64748b; }
.status-badge.pending { background: #fef9c3; color: #a16207; }
.status-badge.approved { background: #f0fdf4; color: #22c55e; }
.status-badge.rejected { background: #fef2f2; color: #ef4444; }
.status-badge.ignored { background: #f1f5f9; color: #94a3b8; }
.loading, .empty { text-align: center; color: #94a3b8; padding: 24px; }

.tag-list { display: flex; flex-wrap: wrap; gap: 8px; background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.sw-tag { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 8px; font-size: 13px; }
.sw-tag.level-strict { background: #fef2f2; color: #ef4444; }
.sw-tag.level-normal { background: #fef9c3; color: #a16207; }
.sw-tag.level-loose { background: #f0fdf4; color: #22c55e; }
.del-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: inherit; padding: 0 2px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; border-radius: 16px; padding: 28px; width: 460px; max-width: 90vw; display: flex; flex-direction: column; gap: 16px; }
.modal h3 { font-size: 17px; font-weight: 600; color: #0f172a; margin: 0; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 500; color: #374151; }
.form-group input, .form-group select, .form-group textarea { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; }
.form-group textarea { resize: vertical; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-check label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; }
.form-check input { width: auto; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

.pagination { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #64748b; }
.btn-page { padding: 6px 14px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; font-size: 13px; cursor: pointer; }
.btn-page:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
