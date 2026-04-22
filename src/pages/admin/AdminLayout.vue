<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAdminStore } from '../../stores/adminAuth';

const router = useRouter();
const route = useRoute();
const adminStore = useAdminStore();

const isCollapsed = ref(false);

const navItems = [
  { path: '/admin', label: '控制台', icon: '📊', key: 'dashboard' },
  { path: '/admin/users', label: '用户管理', icon: '👥', key: 'users' },
  { path: '/admin/agents', label: 'AI员工', icon: '🤖', key: 'agents' },
  { path: '/admin/moderation', label: '内容审核', icon: '🛡️', key: 'moderation' },
  { path: '/admin/announcements', label: '公告管理', icon: '📢', key: 'announcements' },
  { path: '/admin/sensitive-words', label: '敏感词', icon: '⚠️', key: 'sensitive-words' },
  { path: '/admin/logs', label: '操作日志', icon: '📋', key: 'logs' },
];

const activeKey = computed(() => {
  const path = route.path;
  const match = navItems.find(item => path === item.path || path.startsWith(item.path + '/'));
  return match?.key || 'dashboard';
});

const handleLogout = async () => {
  await adminStore.logout();
  router.push('/admin/login');
};

onMounted(async () => {
  if (!adminStore.isLoggedIn) {
    router.push('/admin/login');
    return;
  }
  await adminStore.fetchMe();
});
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <span v-if="!isCollapsed" class="logo-text">灵策·管理后台</span>
        <button class="collapse-btn" @click="isCollapsed = !isCollapsed">
          {{ isCollapsed ? '→' : '←' }}
        </button>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.key"
          :to="item.path"
          class="nav-item"
          :class="{ active: activeKey === item.key }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div v-if="adminStore.user" class="admin-info">
          <span class="admin-role">{{ adminStore.user.role }}</span>
          <button class="logout-btn" @click="handleLogout">退出</button>
        </div>
      </div>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <h1 class="page-title">{{ navItems.find(n => n.key === activeKey)?.label }}</h1>
        <div class="header-right">
          <span class="admin-name">{{ adminStore.user?.username }}</span>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary, #f8fafc);
}

.admin-sidebar {
  width: 220px;
  background: #1a1b26;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
  flex-shrink: 0;
}

.admin-sidebar.collapsed { width: 60px; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo-text {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.collapse-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
}

.sidebar-nav {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.15s;
}

.nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-item.active { background: #3b82f6; color: #fff; }

.nav-icon { font-size: 16px; flex-shrink: 0; }
.nav-label { white-space: nowrap; overflow: hidden; }

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.admin-info { display: flex; flex-direction: column; gap: 6px; }
.admin-role { font-size: 11px; color: rgba(255,255,255,0.4); }
.logout-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.5);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}
.logout-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }

.admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.page-title { font-size: 18px; font-weight: 600; color: #0f172a; margin: 0; }
.header-right { display: flex; align-items: center; gap: 12px; }
.admin-name { font-size: 14px; color: #64748b; }

.admin-content { flex: 1; padding: 24px; overflow-y: auto; }

@media (max-width: 768px) {
  .admin-sidebar { position: fixed; left: 0; top: 0; bottom: 0; z-index: 100; transform: translateX(-100%); }
  .admin-sidebar.collapsed { transform: translateX(0); width: 60px; }
}
</style>
