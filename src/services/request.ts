import axios, { type AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/auth';

const instance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse<{ success: boolean; data: unknown; message?: string }>) => {
    const body = response.data;
    if (body.success) {
      return body.data as unknown as AxiosResponse;
    }
    return Promise.reject(new Error(body.message || '请求失败'));
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await instance.get(url, { params });
  return res as unknown as T;
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
  const res = await instance.post(url, data);
  return res as unknown as T;
}

export async function put<T>(url: string, data?: unknown): Promise<T> {
  const res = await instance.put(url, data);
  return res as unknown as T;
}

export async function del<T = void>(url: string): Promise<T> {
  const res = await instance.delete(url);
  return res as unknown as T;
}

export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const res = await instance.patch(url, data);
  return res as unknown as T;
}
