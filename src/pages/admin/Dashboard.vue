<script setup lang="ts">
import { ref, onMounted } from 'vue';
import adminRequest from '../../utils/adminRequest';

const stats = ref({ total_users: 0, total_sessions: 0, total_messages: 0, today_users: 0, today_chats: 0 });
const realtime = ref({ online_users: 0, today_messages: 0 });
const topAgents = ref<any[]>([]);
const trends = ref<any[]>([]);
const loading = ref(true);

const fetchAll = async () => {
  loading.value = true;
  try {
    const [overview, rt, agents, trendData] = await Promise.all([
      adminRequest.get<any>('/api/admin/stats/overview'),
      adminRequest.get<any>('/api/admin/stats/realtime'),
      adminRequest.get<any>('/api/admin/stats/agents'),
      adminRequest.get<any>('/api/admin/stats/trends?days=7'),
    ]);
    if (overview.data?.code === 200) stats.value = overview.data.data;
    if (rt.data?.code === 200) realtime.value = rt.data.data;
    if (agents.data?.code === 200) topAgents.value = agents.data.data?.slice(0, 10) || [];
    if (trendData.data?.code === 200) trends.value = trendData.data.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAll);

const formatNumber = (n: number) => n?.toLocaleString() || '0';
</script>

<template>
  <div class="dashboard">
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-body">
          <div class="stat-value">{{ formatNumber(stats.total_users) }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💬</div>
        <div class="stat-body">
          <div class="stat-value">{{ formatNumber(stats.total_sessions) }}</div>
          <div class="stat-label">总会话数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📨</div>
        <div class="stat-body">
          <div class="stat-value">{{ formatNumber(stats.total_messages) }}</div>
          <div class="stat-label">总消息数</div>
        </div>
      </div>
      <div class="stat-card highlight">
        <div class="stat-icon">🟢</div>
        <div class="stat-body">
          <div class="stat-value">{{ formatNumber(realtime.online_users) }}</div>
          <div class="stat-label">当前在线</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-body">
          <div class="stat-value">{{ formatNumber(stats.today_users) }}</div>
          <div class="stat-label">今日新用户</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-body">
          <div class="stat-value">{{ formatNumber(realtime.today_messages) }}</div>
          <div class="stat-label">今日消息</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="panel">
        <h3 class="panel-title">🔥 AI员工使用排行（Top 10）</h3>
        <div v-if="loading" class="loading-text">加载中...</div>
        <table v-else class="data-table">
          <thead>
            <tr><th>员工</th><th>会话</th><th>消息</th></tr>
          </thead>
          <tbody>
            <tr v-for="agent in topAgents" :key="agent.id">
              <td><span class="agent-icon">{{ agent.icon }}</span> {{ agent.name }}</td>
              <td>{{ formatNumber(agent.sessions) }}</td>
              <td>{{ formatNumber(agent.messages) }}</td>
            </tr>
            <tr v-if="!topAgents.length"><td colspan="3" class="empty">暂无数据</td></tr>
          </tbody>
        </table>
      </div>

      <div class="panel">
        <h3 class="panel-title">📈 近7天趋势</h3>
        <div v-if="loading" class="loading-text">加载中...</div>
        <div v-else-if="trends.length" class="trend-list">
          <div v-for="day in trends.slice(-7)" :key="day.date" class="trend-row">
            <span class="trend-date">{{ day.date }}</span>
            <div class="trend-bar-wrap">
              <div class="trend-bar" :style="{ width: `${Math.min(100, (day.new_users / Math.max(...trends.map(t => t.new_users || 1))) * 100)}%` }" />
            </div>
            <span class="trend-val">{{ day.new_users }} 用户</span>
          </div>
        </div>
        <div v-else class="empty">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 20px; }

.stat-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.stat-card.highlight { background: #f0fdf4; }
.stat-icon { font-size: 28px; }
.stat-value { font-size: 24px; font-weight: 700; color: #0f172a; }
.stat-label { font-size: 13px; color: #64748b; margin-top: 2px; }

.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.panel-title { font-size: 15px; font-weight: 600; color: #0f172a; margin: 0 0 16px; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 8px 12px; color: #64748b; font-weight: 500; border-bottom: 1px solid #f1f5f9; }
.data-table td { padding: 8px 12px; color: #374151; border-bottom: 1px solid #f8fafc; }
.data-table tr:last-child td { border-bottom: none; }
.agent-icon { font-size: 16px; }
.empty { text-align: center; color: #94a3b8; padding: 20px; }
.loading-text { color: #94a3b8; font-size: 14px; padding: 20px; text-align: center; }

.trend-list { display: flex; flex-direction: column; gap: 10px; }
.trend-row { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.trend-date { width: 72px; color: #64748b; flex-shrink: 0; }
.trend-bar-wrap { flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
.trend-bar { height: 100%; background: #3b82f6; border-radius: 4px; transition: width 0.4s; }
.trend-val { width: 72px; color: #374151; text-align: right; flex-shrink: 0; }

@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
</style>
