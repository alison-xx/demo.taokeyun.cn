import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : '');

const request = axios.create({
  baseURL: apiBaseURL,
  timeout: 60000,
});

request.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code && res.code !== 200) {
      if (res.code === 401) {
        const authStore = useAuthStore();
        authStore.logout();
        window.dispatchEvent(new CustomEvent('auth-required'));
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.dispatchEvent(new CustomEvent('auth-required'));
    }
    return Promise.reject(error);
  }
);

export default request;
