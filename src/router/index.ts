import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'about',
    component: { template: '<div class="text-center text-xl p-8">About Page - Coming Soon</div>' },
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/pages/admin/Login.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/pages/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true } as any,
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@/pages/admin/Dashboard.vue') },
      { path: 'users', name: 'admin-users', component: () => import('@/pages/admin/Users.vue') },
      { path: 'agents', name: 'admin-agents', component: () => import('@/pages/admin/Agents.vue') },
      { path: 'moderation', name: 'admin-moderation', component: () => import('@/pages/admin/System.vue') },
      { path: 'announcements', name: 'admin-announcements', redirect: '/admin/moderation' },
      { path: 'sensitive-words', name: 'admin-sensitive-words', redirect: '/admin/moderation' },
      { path: 'logs', name: 'admin-logs', redirect: '/admin/moderation' },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes as any,
});

router.beforeEach((to) => {
  if ((to.meta as any)?.requiresAdmin) {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      return { name: 'admin-login' };
    }
  }
});

export default router;
