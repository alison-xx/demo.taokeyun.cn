import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import adminRequest from '../utils/adminRequest.js';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const useAdminStore = defineStore('admin', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'));
  const user = ref<AdminUser | null>(JSON.parse(localStorage.getItem('admin_user') || 'null'));

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  const setAuth = (newToken: string, adminUser: AdminUser) => {
    token.value = newToken;
    user.value = adminUser;
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(adminUser));
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  const login = async (username: string, password: string) => {
    const res = await adminRequest.post<any>('/api/admin/auth/login', { username, password });
    const data = res.data;
    if (data?.code === 200) {
      setAuth(data.data.token, data.data.admin);
    }
    return data;
  };

  const logout = async () => {
    clearAuth();
  };

  const fetchMe = async () => {
    if (!token.value) return null;
    try {
      const res = await adminRequest.get<any>('/api/admin/auth/me');
      if (res.data?.code === 200) {
        user.value = res.data.data;
        return res.data.data;
      }
    } catch { clearAuth(); }
    return null;
  };

  return { token, user, isLoggedIn, setAuth, clearAuth, login, logout, fetchMe };
});
