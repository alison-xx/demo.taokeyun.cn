import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import request from '../utils/request.js';

interface User {
  id: number;
  email: string;
  username: string;
  avatar_url?: string;
  role: string;
  onboarded?: boolean;
  quota?: {
    chat_limit: number;
    used_chats: number;
    paint_limit: number;
    used_paints: number;
    quota_reset_at: string;
  } | null;
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const guestSessionId = ref<string | null>(sessionStorage.getItem('guest_session_id'));

  const isLoggedIn = computed(() => !!accessToken.value && !!user.value);

  const setAuth = (data: { accessToken: string; refreshToken: string; user: User }) => {
    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
    user.value = data.user;
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const setUser = (userData: User) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearAuth = () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const ensureGuestSession = () => {
    if (!guestSessionId.value) {
      guestSessionId.value = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem('guest_session_id', guestSessionId.value);
    }
    return guestSessionId.value;
  };

  const fetchProfile = async () => {
    try {
      const res = await request.get<any>('/api/auth/profile');
      if ((res.data as any).code === 200) {
        setUser(res.data);
        return res.data;
      }
    } catch {
      return null;
    }
  };

  const register = async (email: string, password: string, nickname?: string) => {
    const res = await request.post<any>('/api/auth/register/email', { email, password, nickname });
    if ((res.data as any).code === 200) {
      setAuth((res.data as any).data);
    }
    return res;
  };

  const login = async (email: string, password: string) => {
    const res = await request.post<any>('/api/auth/login/email', { email, password });
    if ((res.data as any).code === 200) {
      setAuth((res.data as any).data);
    }
    return res;
  };

  const logout = async () => {
    try {
      await request.post('/api/auth/logout', { refreshToken: refreshToken.value });
    } catch {
      // ignore
    }
    clearAuth();
  };

  const logoutAll = async () => {
    try {
      await request.post('/api/auth/logout-all');
    } catch {
      // ignore
    }
    clearAuth();
  };

  const getSessions = async () => {
    const res = await request.get<any>('/api/auth/sessions');
    return res;
  };

  const revokeSession = async (sessionId: number) => {
    const res = await request.delete(`/api/auth/sessions/${sessionId}`);
    return res;
  };

  const migrateGuest = async (token: string, guestSid: string) => {
    const res = await request.post<any>('/api/auth/guest/migrate', { migrationToken: token, guestSessionId: guestSid });
    return res;
  };

  const updateProfile = async (data: { nickname?: string; avatar?: string }) => {
    const res = await request.put<any>('/api/auth/profile', data);
    if ((res.data as any).code === 200) {
      await fetchProfile();
    }
    return res;
  };

  return {
    accessToken,
    refreshToken,
    user,
    guestSessionId,
    isLoggedIn,
    setAuth,
    setUser,
    clearAuth,
    ensureGuestSession,
    fetchProfile,
    register,
    login,
    logout,
    logoutAll,
    getSessions,
    revokeSession,
    migrateGuest,
    updateProfile,
  };
});
