const AdminApi = {
  BASE: '/api',
  TOKEN_KEY: 'admin_token',
  USER_KEY: 'admin_user',

  get token() { return localStorage.getItem(this.TOKEN_KEY) || ''; },
  set token(v) { if (v) localStorage.setItem(this.TOKEN_KEY, v); else localStorage.removeItem(this.TOKEN_KEY); },

  get user() { try { return JSON.parse(localStorage.getItem(this.USER_KEY) || 'null'); } catch { return null; } },
  set user(v) { if (v) localStorage.setItem(this.USER_KEY, JSON.stringify(v)); else localStorage.removeItem(this.USER_KEY); },

  get isLoggedIn() { return !!this.token; },
  get isAdmin() { return this.user?.role === 'admin'; },

  async request(path, options = {}) {
    const headers = options.headers || {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

    try {
      const res = await fetch(this.BASE + path, { ...options, headers });
      const data = await res.json();
      if (data.code === 401 || data.code === 403) {
        this.logout();
        Toast.error('登录已过期，请重新登录');
        showAdminLogin();
        return null;
      }
      return data;
    } catch (e) {
      Toast.error('网络请求失败: ' + e.message);
      return null;
    }
  },

  async login(email, password, code) {
    const body = { email };
    if (password) body.password = password;
    if (code) body.code = code;
    const res = await this.request('/auth/login', { method: 'POST', body: JSON.stringify(body) });
    if (res?.code === 200) {
      if (res.data?.user?.role !== 'admin') { Toast.error('该账号不是管理员'); return null; }
      this.token = res.data.token;
      this.user = res.data.user;
      Toast.success('管理员登录成功');
      return res.data;
    }
    Toast.error(res?.message || '登录失败');
    return null;
  },

  async sendCode(email) {
    const res = await this.request('/auth/send-code', { method: 'POST', body: JSON.stringify({ email, type: 'login' }) });
    if (res?.code === 200) { Toast.success('验证码已发送'); return true; }
    Toast.error(res?.message || '发送失败');
    return false;
  },

  logout() { this.token = ''; this.user = null; },

  async dashboard() { return this.request('/admin/dashboard'); },
  async statistics(days = 14) { return this.request(`/admin/statistics?days=${days}`); },

  async users(page = 1, keyword = '', role = '', status = '') {
    let q = `?page=${page}&keyword=${encodeURIComponent(keyword)}`;
    if (role) q += `&role=${encodeURIComponent(role)}`;
    if (status !== '') q += `&status=${status}`;
    return this.request(`/admin/users${q}`);
  },

  async userDetail(userId) { return this.request(`/admin/user/detail?user_id=${userId}`); },

  async updateUserStatus(userId, status) { return this.request('/admin/user/status', { method: 'POST', body: JSON.stringify({ user_id: userId, status }) }); },
  async batchUserStatus(ids, status) { return this.request('/admin/user/batch-status', { method: 'POST', body: JSON.stringify({ ids, status }) }); },
  async deleteUser(userId) { return this.request('/admin/user/delete', { method: 'POST', body: JSON.stringify({ user_id: userId }) }); },
  async createAdmin(email, password) { return this.request('/admin/admin/create', { method: 'POST', body: JSON.stringify({ email, password }) }); },
  async updateUserQuota(userId, quota) { return this.request('/admin/user/quota', { method: 'POST', body: JSON.stringify({ user_id: userId, quota }) }); },
  async exportUsers() { window.open(AdminApi.BASE + '/admin/users/export?token=' + AdminApi.token, '_blank'); },

  async sessions(page = 1, employeeId = '', startDate = '', endDate = '') {
    let q = `?page=${page}&employee_id=${encodeURIComponent(employeeId)}`;
    if (startDate) q += `&start_date=${startDate}`;
    if (endDate) q += `&end_date=${endDate}`;
    return this.request(`/admin/sessions${q}`);
  },

  async sessionDetail(sessionId) { return this.request(`/admin/session/detail?session_id=${sessionId}`); },
  async deleteSession(sessionId) { return this.request('/admin/session/delete', { method: 'POST', body: JSON.stringify({ session_id: sessionId }) }); },
  async deleteBatchSessions(ids) { return this.request('/admin/sessions/batch-delete', { method: 'POST', body: JSON.stringify({ ids }) }); },

  async configs(group = '') { return this.request(`/admin/configs${group ? '?group=' + group : ''}`); },
  async updateConfig(key, value) { return this.request('/admin/config/update', { method: 'POST', body: JSON.stringify({ key, value }) }); },
  async batchUpdateConfigs(items) { return this.request('/admin/configs/batch-update', { method: 'POST', body: JSON.stringify({ items }) }); },

  async logs(page = 1, action = '', startDate = '', endDate = '') {
    let q = `?page=${page}`;
    if (action) q += `&action=${encodeURIComponent(action)}`;
    if (startDate) q += `&start_date=${startDate}`;
    if (endDate) q += `&end_date=${endDate}`;
    return this.request(`/admin/logs${q}`);
  },

  async clearLogs(days = 30) { return this.request('/admin/logs/clear', { method: 'POST', body: JSON.stringify({ days }) }); },
  async systemInfo() { return this.request('/admin/system/info'); },
};

// ============ 配置项中文映射表 ============
const CONFIG_GROUP_LABELS = {
  'basic': '📌 基础设置',
  'ai_providers': '🤖 AI服务配置',
  'email': '📧 邮件服务设置',
  'quota': '📊 配额与试用设置',
  'system': '⚙️ 系统功能开关',
  'security': '🔐 安全与权限设置'
};

const CONFIG_KEY_LABELS = {
  // 基础设置
  'site_name': '站点名称',
  'site_url': '站点地址',
  'contact_email': '联系邮箱',
  'icp_license': 'ICP备案号',

  // AI服务配置
  'deepseek_api_key': 'DeepSeek API密钥',
  'minimax_api_key': 'MiniMax API密钥',
  'siliconflow_api_key': 'SiliconFlow API密钥',

  // 邮件服务
  'smtp_host': 'SMTP服务器地址',
  'smtp_port': 'SMTP端口号',
  'smtp_user': 'SMTP授权账号',
  'smtp_pass': 'SMTP授权密码',
  'from_address': '发件人邮箱地址',
  'from_name': '发件人显示名称',

  // 配额设置
  'default_quota_messages': '默认对话配额',
  'default_quota_paintings': '默认绘画配额',
  'trial_days': '试用天数',

  // 系统功能
  'register_enabled': '开放用户注册',
  'maintenance_mode': '维护模式',

  // 安全设置
  'jwt_secret': 'JWT加密密钥',
  'code_expire_minutes': '验证码有效期',
  'max_login_attempts': '最大登录尝试次数'
};

function getConfigGroupLabel(groupKey) {
  return CONFIG_GROUP_LABELS[groupKey] || groupKey;
}

function getConfigKeyLabel(key) {
  return CONFIG_KEY_LABELS[key] || key;
}

const Toast = {
  container: null,
  _init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toastContainer';
    this.container.style.cssText = 'position:fixed;top:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(this.container);
  },
  show(msg, type = 'info', duration = 3000) {
    this._init();
    const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#6366f1' };
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const el = document.createElement('div');
    el.style.cssText = `
      padding:12px 20px;border-radius:10px;color:#fff;font-size:14px;font-weight:500;
      background:${colors[type] || colors.info};box-shadow:0 8px 24px rgba(0,0,0,0.18);
      display:flex;align-items:center;gap:8px;pointer-events:auto;cursor:pointer;
      transform:translateX(120%);transition:transform 0.35s cubic-bezier(.4,0,.2,1);
      max-width:380px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    `;
    el.innerHTML = `<span style="font-size:16px;font-weight:700">${icons[type] || ''}</span><span>${msg}</span>`;
    el.onclick = () => this._dismiss(el);
    this.container.appendChild(el);
    requestAnimationFrame(() => { el.style.transform = 'translateX(0)'; });
    if (duration > 0) setTimeout(() => this._dismiss(el), duration);
    return el;
  },
  _dismiss(el) {
    if (!el || !el.parentNode) return;
    el.style.transform = 'translateX(120%)';
    el.style.opacity = '0';
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  },
  success(msg, d) { return this.show(msg, 'success', d); },
  error(msg, d) { return this.show(msg, 'error', d); },
  warning(msg, d) { return this.show(msg, 'warning', d); },
  info(msg, d) { return this.show(msg, 'info', d); },
};

function showAdminLogin() {
  let modal = document.getElementById('adminLoginModal');
  if (modal) { modal.classList.add('show'); return; }

  modal = document.createElement('div');
  modal.id = 'adminLoginModal';
  modal.className = 'admin-login-overlay';
  modal.innerHTML = `
    <div class="admin-login-panel">
      <div class="admin-login-header">
        <h2>🔐 管理员登录</h2>
        <p>请使用管理员账号登录后台</p>
      </div>
      <div class="admin-login-tabs">
        <button class="active" data-tab="password">密码登录</button>
        <button data-tab="code">验证码登录</button>
      </div>
      <form id="adminLoginForm" onsubmit="return handleAdminLogin(event)">
        <div class="form-row">
          <label>管理员邮箱</label>
          <input type="email" id="adminEmail" placeholder="请输入管理员邮箱" required autocomplete="email">
        </div>
        <div class="form-row form-password-row" id="adminPasswordRow">
          <label>密码</label>
          <input type="password" id="adminPassword" placeholder="请输入密码" autocomplete="current-password">
        </div>
        <div class="form-row form-code-row" id="adminCodeRow" style="display:none;">
          <label>验证码</label>
          <div style="display:flex;gap:8px;">
            <input type="text" id="adminCode" placeholder="6位验证码" maxlength="6" style="flex:1;">
            <button type="button" class="btn btn-primary" id="adminSendCodeBtn" onclick="handleAdminSendCode()">获取验证码</button>
          </div>
        </div>
        <div id="adminLoginError" class="admin-login-error"></div>
        <button type="submit" class="btn btn-primary admin-login-submit" id="adminLoginSubmitBtn">登 录</button>
      </form>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .admin-login-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center;
      z-index: 9000; animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .admin-login-panel {
      width: 420px; max-width: 92vw; background: var(--card-bg, #fff);
      border-radius: 20px; padding: 36px 32px 32px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset;
      animation: slideUp 0.35s cubic-bezier(.4,0,.2,1);
    }
    @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
    .admin-login-header h2 { font-size: 22px; color: var(--text-primary, #1a1a2e); margin-bottom: 6px; }
    .admin-login-header p { font-size: 14px; color: var(--text-secondary, #888); margin-bottom: 24px; }
    .admin-login-tabs { display: flex; gap: 4px; background: var(--bg-tertiary, #f3f4f6); border-radius: 10px; padding: 4px; margin-bottom: 24px; }
    .admin-login-tabs button {
      flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer;
      font-size: 14px; font-weight: 500; color: var(--text-secondary, #666); background: transparent;
      transition: all 0.25s ease;
    }
    .admin-login-tabs button.active { background: var(--card-bg, #fff); color: #667eea; box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-weight: 600; }
    .admin-login-panel .form-row { margin-bottom: 18px; }
    .admin-login-panel .form-row label { display: block; font-size: 13px; color: var(--text-secondary, #555); margin-bottom: 6px; font-weight: 500; }
    .admin-login-panel .form-row input {
      width: 100%; padding: 11px 14px; border: 1.5px solid var(--border-color, #e5e7eb); border-radius: 10px;
      font-size: 14px; transition: all 0.2s; outline: none; background: var(--input-bg, #fff);
      color: var(--text-primary, #333);
    }
    .admin-login-panel .form-row input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.15); }
    .admin-login-error { color: #ef4444; font-size: 13px; min-height: 20px; margin-bottom: 12px; text-align: center; }
    .admin-login-submit {
      width: 100%; padding: 13px; border: none; border-radius: 10px;
      font-size: 15px; font-weight: 600; cursor: pointer;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff;
      transition: all 0.25s; letter-spacing: 4px;
    }
    .admin-login-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(102,126,234,0.35); }
    .admin-login-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .admin-login-overlay.show { display: flex !important; opacity: 1; visibility: visible; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(modal);

  modal.querySelectorAll('.admin-login-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.admin-login-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isPassword = btn.dataset.tab === 'password';
      document.getElementById('adminPasswordRow').style.display = isPassword ? '' : 'none';
      document.getElementById('adminCodeRow').style.display = isPassword ? 'none' : '';
    });
  });

  return modal;
}

// 管理员退出登录
function adminLogout() {
  if (!confirm('确定要退出登录吗？')) return;
  
  AdminApi.logout();
  Toast.success('已退出登录');
  setTimeout(() => {
    window.location.href = 'admin.html';
  }, 1000);
}

// 显示创建管理员弹窗
function showCreateAdminModal() {
  const modal = document.createElement('div');
  modal.id = 'createAdminModal';
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>👑 创建管理员账号</h3>
        <button class="modal-close" onclick="document.getElementById('createAdminModal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <label>管理员邮箱</label>
          <input type="email" id="createAdminEmail" placeholder="请输入管理员邮箱">
        </div>
        <div class="form-row">
          <label>密码</label>
          <input type="password" id="createAdminPassword" placeholder="请输入密码（至少6位）">
        </div>
        <div class="form-row">
          <label>确认密码</label>
          <input type="password" id="createAdminConfirmPassword" placeholder="请再次输入密码">
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="document.getElementById('createAdminModal').remove()">取消</button>
          <button class="btn btn-primary" onclick="createAdmin()">创建</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// 创建管理员账号
async function createAdmin() {
  const email = document.getElementById('createAdminEmail').value.trim();
  const password = document.getElementById('createAdminPassword').value;
  const confirmPassword = document.getElementById('createAdminConfirmPassword').value;

  if (!email) { Toast.error('请输入邮箱'); return; }
  if (!password) { Toast.error('请输入密码'); return; }
  if (password.length < 6) { Toast.error('密码长度至少6位'); return; }
  if (password !== confirmPassword) { Toast.error('两次输入的密码不一致'); return; }

  const res = await AdminApi.createAdmin(email, password);
  if (res?.code === 200) {
    Toast.success('管理员账号创建成功');
    document.getElementById('createAdminModal').remove();
    loadUsers(1); // 刷新用户列表
  } else {
    Toast.error(res?.message || '创建失败');
  }
}

let adminCountdownTimer = null;

async function handleAdminSendCode() {
  const email = document.getElementById('adminEmail').value.trim();
  if (!email || !email.includes('@')) { Toast.error('请输入有效邮箱'); return; }
  const btn = document.getElementById('adminSendCodeBtn');
  btn.disabled = true;
  const ok = await AdminApi.sendCode(email);
  if (ok) {
    let sec = 60;
    btn.textContent = `${sec}s 后重发`;
    adminCountdownTimer = setInterval(() => {
      sec--;
      if (sec <= 0) { clearInterval(adminCountdownTimer); btn.disabled = false; btn.textContent = '获取验证码'; }
      else btn.textContent = `${sec}s 后重发`;
    }, 1000);
  } else btn.disabled = false;
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPasswordRow').style.display !== 'none'
    ? document.getElementById('adminPassword').value : '';
  const code = document.getElementById('adminCodeRow').style.display !== 'none'
    ? document.getElementById('adminCode').value.trim() : '';
  const errEl = document.getElementById('adminLoginError');
  const submitBtn = document.getElementById('adminLoginSubmitBtn');

  if (!email) { errEl.textContent = '请输入邮箱'; return; }
  if (!password && !code) { errEl.textContent = '请输入密码或验证码'; return; }

  errEl.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = '登录中...';

  const result = await AdminApi.login(email, password || null, code || null);

  submitBtn.disabled = false;
  submitBtn.textContent = '登 录';

  if (result) {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.remove('show');
    updateAdminHeader();
    loadDashboard();
  } else errEl.textContent = '登录失败，请检查凭据';
}

function updateAdminHeader() {
  const el = document.getElementById('adminUserInfo');
  if (!el) return;
  const u = AdminApi.user;
  if (u) {
    el.innerHTML = `<span class="admin-avatar">${(u.nickname||'?')[0]}</span><span>${u.nickname||u.email}</span><a href="/" target="_blank">返回前台</a><button onclick="handleLogout()" class="btn-icon" title="退出">⏻</button>`;
  }
}

function handleLogout() {
  AdminApi.logout();
  showAdminLogin();
}

async function checkAdminAuth() {
  if (!AdminApi.isLoggedIn) { showAdminLogin(); return false; }
  const res = await AdminApi.dashboard();
  if (!res) { showAdminLogin(); return false; }
  updateAdminHeader();
  return true;
}

let autoRefreshTimer = null;

function createLineChart(canvasId, labels, datasets, legends, colors) {
  const ctx = $(canvasId);
  if (!ctx) return null;
  const isDark = document.documentElement.dataset.theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: datasets.map((d, i) => ({ label: legends[i], data: d, borderColor: colors[i], backgroundColor: colors[i] + '15', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointHoverRadius: 6 })) },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: { legend: { position: 'top', labels: { color: textColor, usePointStyle: true, padding: 16 } }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 12, cornerRadius: 8 } },
      scales: { x: { grid: { color: gridColor }, ticks: { color: textColor } }, y: { grid: { color: gridColor }, ticks: { color: textColor }, beginAtZero: true } }
    }
  });
}

function destroyCharts() {
  Object.values(dashboardCharts).forEach(c => c && c.destroy());
  dashboardCharts = {};
}

async function loadDashboard() {
  const res = await AdminApi.dashboard();
  if (!res || res.code !== 200) return;
  const d = res.data;

  const stats = [
    { label: '总用户数', value: d.users.total, icon: '👤', sub: `今日 +${d.users.today}`, cls: 'users' },
    { label: '总会话数', value: d.sessions, icon: '💬', sub: '', cls: 'sessions' },
    { label: '总消息数', value: d.messages, icon: '📨', sub: '', cls: 'messages' },
    { label: '绘画作品', value: d.paintings, icon: '🎨', sub: '', cls: 'paintings' },
  ];

  $('statsGrid').innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon ${s.cls}">${s.icon}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
      ${s.sub ? `<div class="stat-sub">↑ ${s.sub}</div>` : ''}
    </div>`).join('');

  $('recentUsersList').innerHTML = (d.recent_users || []).length ? d.recent_users.map(u => `
    <li class="recent-item">
      <span class="recent-item-info"><span class="recent-dot" style="background:${u.role==='admin'?'#f59e0b':'#10b981'}"></span><span>${u.nickname || u.email}</span></span>
      <span style="color:var(--text-muted);font-size:12px">${u.created_at?.substring(5,16)}</span>
    </li>`).join('') : '<div class="empty-state"><p>暂无数据</p></div>';

  $('recentLogsList').innerHTML = (d.recent_logs || []).length ? d.recent_logs.map(l => `
    <li class="recent-item">
      <span class="recent-item-info"><span class="recent-dot" style="background:var(--accent)"></span><span>${actionLabels[l.action]||l.action}</span></span>
      <span style="color:var(--text-muted);font-size:12px">${l.created_at?.substring(5,16)}</span>
    </li>`).join('') : '<div class="empty-state"><p>暂无数据</p></div>';
}

async function loadStatistics(days = 14) {
  const res = await AdminApi.statistics(days);
  if (!res || res.code !== 200) return;
  const d = res.data;

  $('summaryStats').innerHTML = [
    { label:'总用户数', value:d.summary.total_users, icon:'👤', cls:'users' },
    { label:'总消息数', value:d.summary.total_messages, icon:'📨', cls:'messages' },
    { label:'总会话数', value:d.summary.total_sessions, icon:'💬', cls:'sessions' },
    { label:'平均每会话消息', value:d.summary.avg_messages_per_session, icon:'📊', cls:'sessions' },
  ].map(s => `<div class="stat-card"><div class="stat-icon ${s.cls}">${s.icon}</div><div class="stat-label">${s.label}</div><div class="stat-value">${typeof s.value==='number'?s.value.toLocaleString():s.value}</div></div>`).join('');

  destroyCharts();
  const labels = d.daily_users.map(x => x.date);

  dashboardCharts.users = createLineChart('chartUsers', labels, [d.daily_users.map(x => x.value)], ['新增用户'], ['#667eea']);
  dashboardCharts.messages = createLineChart('chartMessages', labels, [d.daily_messages.map(x => x.value)], ['消息量'], ['#10b981']);
  dashboardCharts.sp = createLineChart('chartSessionsPaintings', labels,
    [d.daily_sessions.map(x => x.value), d.daily_paintings.map(x => x.value)],
    ['会话数','绘画数'], ['#6366f1','#ef4444']);

  if (d.role_distribution && d.role_distribution.length) {
    const isDark = document.documentElement.dataset.theme === 'dark';
    dashboardCharts.role = new Chart($('chartRoleDist'), {
      type: 'doughnut',
      data: {
        labels: d.role_distribution.map(r => r.role === 'admin' ? '管理员' : '普通用户'),
        datasets: [{ data: d.role_distribution.map(r => r.cnt), backgroundColor: ['#667eea','#10b981'], borderWidth: 0, hoverOffset: 8 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: isDark?'#94a3b8':'#64748b', padding: 12 } }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}人 (${Math.round(ctx.parsed/d.role_distribution.reduce((a,b)=>a+b.cnt,0)*100)}%)` } } } }
    });
  }

  if (d.top_employees && d.top_employees.length) {
    const isDark = document.documentElement.dataset.theme === 'dark';
    dashboardCharts.topEmp = new Chart($('chartTopEmployees'), {
      type: 'bar',
      data: {
        labels: d.top_employees.map(e => e.employee_name || e.employee_id),
        datasets: [{ label: '会话数', data: d.top_employees.map(e => e.session_count), backgroundColor: '#764ba2', borderRadius: 6, maxBarThickness: 40 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { grid: { color: isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)' }, ticks: { color: isDark?'#94a3b8':'#64748b' } }, y: { grid: { display: false }, ticks: { color: isDark?'#94a3b8':'#64748b' } } }
      }
    });
  }
}

let userPage = 1, userKeyword = '', userRole = '', userStatus = '';

async function loadUsers(page = 1) {
  userPage = page;
  userKeyword = $('userSearch')?.value?.trim() || '';
  userRole = $('userRoleFilter')?.value || '';
  userStatus = $('userStatusFilter')?.value || '';

  const res = await AdminApi.users(userPage, userKeyword, userRole, userStatus);
  if (!res || res.code !== 200) return;

  const list = res.data?.list || [];
  $('userTableBody').innerHTML = list.length ? list.map(u => `
    <tr>
      <td class="checkbox-col"><input type="checkbox" value="${u.id}" onchange="toggleUserSelect(${u.id},this.checked)"></td>
      <td>${u.id}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis">${u.email}</td>
      <td>${u.nickname || '-'}</td>
      <td><span class="badge badge-${u.role}">${u.role === 'admin' ? '管理员' : '用户'}</span></td>
      <td><span class="badge badge-${u.status ? 'active' : 'inactive'}">${u.status ? '正常' : '禁用'}</span></td>
      <td>${renderQuotaBar(u.quota)}</td>
      <td style="white-space:nowrap">${u.created_at?.substring(0,19)}</td>
      <td>
        <button class="btn btn-xs btn-outline" onclick="showUserDetail(${u.id})">详情</button>
        <button class="btn btn-xs btn-warning" onclick="showQuotaModal(${u.id})">配额</button>
        <button class="btn btn-xs ${u.status ? 'btn-danger' : 'btn-success'}" onclick="toggleUserStatus(${u.id},${u.status?0:1})">${u.status?'禁用':'启用'}</button>
        <button class="btn btn-xs btn-danger" onclick="deleteUser(${u.id})">删除</button>
      </td>
    </tr>`).join('') : '<tr><td colspan="9"><div class="empty-state"><p>暂无用户数据</p></div></td></tr>';

  renderPagination('userPagination', res.data?.total || 0, userPage, 20, loadUsers);
  updateBatchBar('userBatchBar', 'selectedCount', selectedUserIds.size);
}

function renderQuotaBar(q) {
  if (!q) return '-';
  const msgTotal = q.quota_messages || 0;
  const msgUsed = q.used_messages || 0;
  const pct = msgTotal <= 0 ? 0 : Math.min(100, Math.round((msgUsed / msgTotal) * 100));
  const cls = pct > 80 ? 'high' : pct > 50 ? 'mid' : 'low';
  return `<div class="quota-bar"><div class="quota-bar-track"><div class="quota-bar-fill ${cls}" style="width:${pct}%"></div></div><span>${msgUsed}/${msgTotal===-1?'∞':msgTotal}</span></div>`;
}

function toggleUserSelect(id, checked) {
  if (checked) selectedUserIds.add(id); else selectedUserIds.delete(id);
  updateBatchBar('userBatchBar', 'selectedCount', selectedUserIds.size);
}

function toggleSelectAll(el) {
  const checkboxes = document.querySelectorAll('#userTableBody input[type="checkbox"]');
  checkboxes.forEach(cb => { cb.checked = el.checked; toggleUserSelect(parseInt(cb.value), el.checked); });
}

function clearUserSelection() {
  selectedUserIds.clear();
  document.querySelectorAll('#userTableBody input[type="checkbox"]').forEach(cb => cb.checked = false);
  updateBatchBar('userBatchBar', 'selectedCount', 0);
}

function updateBatchBar(barId, countId, num) {
  const bar = $(barId);
  if (!bar) return;
  bar.classList.toggle('show', num > 0);
  const cnt = $(countId);
  if (cnt) cnt.textContent = num;
}

async function batchDisableUsers() {
  if (!selectedUserIds.size) return;
  if (!confirm(`确定要禁用选中的 ${selectedUserIds.size} 个用户吗？`)) return;
  const res = await AdminApi.batchUserStatus([...selectedUserIds], 0);
  if (res?.code === 200) { Toast.success(res.message); clearUserSelection(); loadUsers(userPage); }
}

async function batchEnableUsers() {
  if (!selectedUserIds.size) return;
  const res = await AdminApi.batchUserStatus([...selectedUserIds], 1);
  if (res?.code === 200) { Toast.success(res.message); clearUserSelection(); loadUsers(userPage); }
}

async function toggleUserStatus(id, status) {
  const res = await AdminApi.updateUserStatus(id, status);
  if (res?.code === 200) { Toast.success(status ? '已启用' : '已禁用'); loadUsers(userPage); }
}

async function deleteUser(id) {
  if (!confirm('确定要删除该用户吗？此操作不可恢复！')) return;
  if (!confirm('请再次确认，删除用户将同时删除该用户的所有会话和消息记录！')) return;
  
  const res = await AdminApi.deleteUser(id);
  if (res?.code === 200) { Toast.success('用户已删除'); loadUsers(userPage); }
}

let quotaUserId = null;

function showQuotaModal(userId) {
  quotaUserId = userId;
  openModal('quotaModal');
}

async function saveQuota() {
  if (!quotaUserId) return;
  const res = await AdminApi.updateUserQuota(quotaUserId, {
    messages: parseInt($('quotaMessages').value) || 0,
    paintings: parseInt($('quotaPaintings').value) || 0,
    expire_at: $('expireAt').value || null
  });
  if (res?.code === 200) { Toast.success('配额更新成功'); closeModal('quotaModal'); loadUsers(userPage); }
}

async function showUserDetail(userId) {
  const res = await AdminApi.userDetail(userId);
  if (!res || res.code !== 200) return;
  const u = res.data.user;
  $('userDetailContent').innerHTML = `
    <div style="margin-bottom:20px;display:flex;align-items:center;gap:16px">
      <div class="admin-avatar" style="width:56px;height:56px;font-size:24px">${(u.nickname||'?')[0]}</div>
      <div><div style="font-size:18px;font-weight:700">${u.nickname||u.email}</div><div style="color:var(--text-muted);font-size:13px">${u.email}</div></div>
    </div>
    <div class="info-grid" style="margin-bottom:20px">
      <div class="info-item"><div class="info-label">用户ID</div><div class="info-value">#${u.id}</div></div>
      <div class="info-item"><div class="info-label">角色</div><div class="info-value"><span class="badge badge-${u.role}">${u.role==='admin'?'管理员':'普通用户'}</span></div></div>
      <div class="info-item"><div class="info-label">状态</div><div class="info-value"><span class="badge badge-${u.status?'active':'inactive'}">${u.status?'正常':'禁用'}</span></div></div>
      <div class="info-item"><div class="info-label">注册时间</div><div class="info-value">${u.created_at||'-'}</div></div>
      <div class="info-item"><div class="info-label">最后登录</div><div class="info-value">${u.last_login_at||'从未登录'}</div></div>
      <div class="info-item"><div class="info-label">会话数</div><div class="info-value">${res.data.session_count||0}</div></div>
      <div class="info-item"><div class="info-label">消息数</div><div class="info-value">${res.data.message_count||0}</div></div>
      <div class="info-item"><div class="info-label">绘画数</div><div class="info-value">${res.data.painting_count||0}</div></div>
    </div>
    ${u.quota ? `<div style="padding:14px;background:var(--bg-tertiary);border-radius:8px;margin-bottom:16px">
      <strong style="font-size:13px">配额信息</strong>
      <div style="display:flex;gap:24px;margin-top:8px;flex-wrap:wrap">
        <span>对话: ${u.quota.used_messages||0}/${u.quota.quota_messages===-1?'∞':u.quota.quota_messages||0}</span>
        <span>绘画: ${u.quota.used_paintings||0}/${u.quota.quota_paintings===-1?'∞':u.quota.quota_paintings||0}</span>
        <span>到期: ${u.quota.expire_at||'永久'}</span>
      </div>
    </div>` : ''}
    ${(res.data.recent_sessions||[]).length ? `<h4 style="margin-bottom:12px;font-size:14px">最近会话</h4>` + res.data.recent_sessions.map(s => `
      <div style="padding:10px;background:var(--bg-tertiary);border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;font-size:13px">
        <span>${s.employee_name||'未命名'} · ${s.title||'无标题'}</span>
        <span style="color:var(--text-muted)">${s.message_count||0}条消息 · ${s.updated_at?.substring(5,11)}</span>
      </div>`).join('') : ''}`;
  openModal('userDetailModal');
}

function exportUserCSV() {
  AdminApi.exportUsers();
  Toast.info('正在导出...');
}

let sessionPage = 1;

async function loadSessions(page = 1) {
  sessionPage = page;
  const empId = $('sessionSearch')?.value?.trim() || '';
  const startDt = $('sessionStartDate')?.value || '';
  const endDt = $('sessionEndDate')?.value || '';

  const res = await AdminApi.sessions(sessionPage, empId, startDt, endDt);
  if (!res || res.code !== 200) return;

  const list = res.data?.list || [];
  $('sessionTableBody').innerHTML = list.length ? list.map(s => `
    <tr>
      <td class="checkbox-col"><input type="checkbox" value="${s.id}" onchange="toggleSessionSelect(${s.id},this.checked)"></td>
      <td>${s.id}</td>
      <td>${s.nickname||s.email||'-'}</td>
      <td>${s.employee_name||s.employee_id||'-'}</td>
      <td class="session-preview" title="${s.title||''}">${s.title||'-'}</td>
      <td>${s.message_count||0}</td>
      <td><span class="badge ${s.collaboration_mode?'badge-info':'badge-active'}">${s.collaboration_mode?'是':'否'}</span></td>
      <td style="white-space:nowrap">${s.updated_at?.substring(0,16)}</td>
      <td>
        <button class="btn btn-xs btn-primary" onclick="viewSessionMessages(${s.id})">查看</button>
        <button class="btn btn-xs btn-danger" onclick="deleteSession(${s.id})">删除</button>
      </td>
    </tr>`).join('') : '<tr><td colspan="9"><div class="empty-state"><p>暂无会话数据</p></div></td></tr>';

  renderPagination('sessionPagination', res.data?.total || 0, sessionPage, 20, loadSessions);
  updateBatchBar('sessionBatchBar', 'sessionSelectedCount', selectedSessionIds.size);
}

function toggleSessionSelect(id, checked) {
  if (checked) selectedSessionIds.add(id); else selectedSessionIds.delete(id);
  updateBatchBar('sessionBatchBar', 'sessionSelectedCount', selectedSessionIds.size);
}

function toggleSelectAllSessions(el) {
  const checkboxes = document.querySelectorAll('#sessionTableBody input[type="checkbox"]');
  checkboxes.forEach(cb => { cb.checked = el.checked; toggleSessionSelect(parseInt(cb.value), el.checked); });
}

function clearSessionSelection() {
  selectedSessionIds.clear();
  document.querySelectorAll('#sessionTableBody input[type="checkbox"]').forEach(cb => cb.checked = false);
  updateBatchBar('sessionBatchBar', 'sessionSelectedCount', 0);
}

async function batchDeleteSessions() {
  if (!selectedSessionIds.size) return;
  if (!confirm(`确定要删除选中的 ${selectedSessionIds.size} 个会话吗？此操作不可恢复！`)) return;
  const res = await AdminApi.deleteBatchSessions([...selectedSessionIds]);
  if (res?.code === 200) { Toast.success(res.message); clearSessionSelection(); loadSessions(sessionPage); }
}

async function deleteSession(sid) {
  if (!confirm('确定删除该会话？')) return;
  const res = await AdminApi.deleteSession(sid);
  if (res?.code === 200) { Toast.success('已删除'); loadSessions(sessionPage); }
}

async function viewSessionMessages(sid) {
  const res = await AdminApi.sessionDetail(sid);
  if (!res || res.code !== 200) return;

  const msgs = res.data.messages || [];
  const username = res.data.username || '用户';
  
  $('sessionDetailContent').innerHTML = msgs.length ? msgs.map(m => `
    <div style="display:flex;gap:12px;margin-bottom:16px;padding:12px;background:var(--bg-tertiary);border-radius:10px;${m.role==='user'?'':'flex-direction:row-reverse'}">
      <div style="width:36px;height:36px;border-radius:50%;background:${m.role==='user'?'linear-gradient(135deg,#667eea,#764ba2)':'linear-gradient(135deg,#10b981,#059669)'};flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:600">${m.role==='user'?'👤':'🤖'}</div>
      <div style="flex:1;max-width:75%">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">${m.role==='user'?username:'AI'} · ${m.created_at?.substring(11,16)}</div>
        <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word">${escapeHtml(m.content||'')}</div>
      </div>
    </div>`).join('') : '<div class="empty-state"><p>该会话暂无消息</p></div>';
  openModal('sessionDetailModal');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadConfigs() {
  const res = await AdminApi.configs();
  if (!res || res.code !== 200) return;

  const configs = Array.isArray(res.data) ? res.data : [];
  const groups = {};
  configs.forEach(c => {
    const g = c.config_group || '其他';
    if (!groups[g]) groups[g] = [];
    groups[g].push(c);
  });

  let html = '';
  for (const [group, items] of Object.entries(groups)) {
    html += `<div class="config-group">
      <div class="config-group-header" onclick="this.parentElement.classList.toggle('collapsed')">
        <span>${getConfigGroupLabel(group)}</span><span class="group-arrow">▼</span>
      </div>
      <div class="config-group-body">${items.map(c => renderConfigItem(c)).join('')}</div>
    </div>`;
  }

  $('configContent').innerHTML = html || '<div class="empty-state"><p>暂无配置项</p></div>';
}

function renderConfigItem(c) {
  const key = c.config_key;
  let inputHtml = '';

  if (c.type === 'boolean') {
    inputHtml = `<input type="checkbox" data-key="${key}" ${c.config_value==='1'||c.config_value===true?'checked':''} onchange="markConfigChange('${key}',this.checked?1:0)">`;
  } else if (c.type === 'select' && c.description && c.description.includes('|')) {
    const opts = c.description.split('|').map(o => o.trim()).filter(Boolean);
    inputHtml = `<select data-key="${key}" onchange="markConfigChange('${key}',this.value)">${opts.map(o => `<option value="${o}" ${c.config_value===o?'selected':''}>${o}</option>`).join('')}</select>`;
  } else if (c.type === 'color') {
    inputHtml = `<input type="color" data-key="${key}" value="${c.config_value||'#000000'}" onchange="markConfigChange('${key}',this.value)" style="width:50px;height:32px;cursor:pointer;border:none">`;
  } else {
    inputHtml = `<input type="text" data-key="${key}" value="${escapeAttr(c.config_value||'')}" onchange="markConfigChange('${key}',this.value)">`;
  }

  return `<div class="config-item">
    <label title="${c.description||''}">${getConfigKeyLabel(key)}</label>
    ${inputHtml}
    <span style="font-size:11px;color:var(--text-muted);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.description?.split('|')[0]||''}</span>
  </div>`;
}

function escapeAttr(str) {
  return str.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

const changedConfigs = new Map();

function markConfigChange(key, value) {
  changedConfigs.set(key, value);
}

async function saveAllConfigs() {
  if (!changedConfigs.size) { Toast.info('没有修改'); return; }
  const items = [...changedConfigs.entries()].map(([k, v]) => ({ key: k, value: v }));
  const res = await AdminApi.batchUpdateConfigs(items);
  if (res?.code === 200) { Toast.success(res.message); changedConfigs.clear(); loadConfigs(); }
}

let logPage = 1;

async function loadLogs(page = 1) {
  logPage = page;
  const action = $('logActionFilter')?.value || '';
  const startDt = $('logStartDate')?.value || '';
  const endDt = $('logEndDate')?.value || '';

  const res = await AdminApi.logs(logPage, action, startDt, endDt);
  if (!res || res.code !== 200) return;

  const list = res.data?.list || [];
  $('logTableBody').innerHTML = list.length ? list.map((l, i) => `
    <tr>
      <td>${l.id}</td>
      <td>管理员#${l.admin_id}</td>
      <td><span class="badge badge-info">${actionLabels[l.action]||l.action}</span></td>
      <td>${l.target_type||'-'}#${l.target_id||'-'}</td>
      <td>
        <span class="log-detail log-expandable" onclick="toggleLogExpand(this,${i})" title="点击展开">${l.content?.substring(0,30)||'-'}...</span>
        <div class="log-expanded" id="logExpand${i}">${escapeHtml(l.content||'')}</div>
      </td>
      <td style="font-family:monospace;font-size:11px">${l.ip_address||'-'}</td>
      <td style="white-space:nowrap">${l.created_at?.substring(0,16)}</td>
    </tr>`).join('') : '<tr><td colspan="7"><div class="empty-state"><p>暂无日志</p></div></td></tr>';

  renderPagination('logPagination', res.data?.total || 0, logPage, 20, loadLogs);
}

function toggleLogExpand(el, idx) {
  const exp = $(`logExpand${idx}`);
  if (exp) exp.classList.toggle('show');
}

function showClearLogsModal() {
  openModal('clearLogsModal');
}

async function confirmClearLogs() {
  const days = parseInt($('clearLogDays').value) || 30;
  if (!confirm(`确定清理 ${days} 天前的所有日志？`)) return;
  const res = await AdminApi.clearLogs(days);
  if (res?.code === 200) { Toast.success(res.message); closeModal('clearLogsModal'); loadLogs(logPage); }
}

async function loadSystemInfo() {
  const res = await AdminApi.systemInfo();
  if (!res || res.code !== 200) return;
  const d = res.data;

  $('systemInfoGrid').innerHTML = [
    { label: 'PHP 版本', value: d.php_version },
    { label: 'MySQL 版本', value: d.mysql_version },
    { label: '操作系统', value: d.server_os },
    { label: '服务器时间', value: d.server_time },
    { label: '时区', value: d.server_timezone },
    { label: '内存限制', value: d.memory_limit },
    { label: '最大执行时间', value: d.max_execution },
    { label: '上传限制', value: d.upload_max },
    { label: 'POST限制', value: d.post_max },
  ].map(i => `<div class="info-item"><div class="info-label">${i.label}</div><div class="info-value">${i.value}</div></div>`).join('');

  $('dbTablesBody').innerHTML = (d.database_tables || []).map(t => `
    <tr><td><code>${t.name}</code></td><td>${t.rows.toLocaleString()}</td><td>${t.size}</td><td>${t.created?.substring(0,10)||'-'}</td></tr>
  `).join('') || '<tr><td colspan="4"><div class="empty-state"><p>无法获取表信息</p></div></td></tr>';
}

function openModal(id) {
  const m = $(id);
  if (m) m.classList.add('show');
}

function closeModal(id) {
  const m = $(id);
  if (m) m.classList.remove('show');
}

function renderPagination(containerId, total, currentPage, pageSize, callback) {
  const container = $(containerId);
  if (!container) return;

  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = '';
  html += `<button ${currentPage<=1?'disabled':''} onclick="${callback.name}(${currentPage-1})">‹</button>`;

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) { html += `<button onclick="${callback.name}(1)">1</button>`; if (start > 2) html += '<span>…</span>'; }

  for (let i = start; i <= end; i++) {
    html += `<button class="${i===currentPage?'active':''}" onclick="${callback.name}(${i})">${i}</button>`;
  }

  if (end < totalPages) { if (end < totalPages - 1) html += '<span>…</span>'; html += `<button onclick="${callback.name}(${totalPages})">${totalPages}</button>`; }

  html += `<button ${currentPage>=totalPages?'disabled':''} onclick="${callback.name}(${currentPage+1})">›</button>`;
  html += `<span style="margin-left:12px;font-size:12px;color:var(--text-muted)">共 ${total} 条，第 ${currentPage}/${totalPages} 页</span>`;

  container.innerHTML = html;
}

$('userSearch')?.addEventListener('keyup', e => { if (e.key === 'Enter') loadUsers(1); });
$('sessionSearch')?.addEventListener('keyup', e => { if (e.key === 'Enter') loadSessions(1); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}

async function initAdmin() {
  const ok = await checkAdminAuth();
  if (ok) {
    loadDashboard();

    autoRefreshTimer = setInterval(async () => {
      if (currentPanel === 'dashboard') {
        const res = await AdminApi.dashboard();
        if (res?.code === 200) {
          const d = res.data;
          const cards = $('statsGrid')?.querySelectorAll('.stat-card');
          if (cards) {
            const vals = [d.users.total, d.sessions, d.messages, d.paintings];
            cards.forEach((card, i) => {
              const v = card.querySelector('.stat-value');
              if (v && vals[i] !== undefined) v.textContent = typeof vals[i]==='number'?vals[i].toLocaleString():vals[i];
            });
          }
        }
      }
    }, 30000);
  }
}

window.addEventListener('beforeunload', () => {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
});

