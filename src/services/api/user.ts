import { get, post, put, del, patch } from '@/services/request';

export interface UserItem {
  id: string;
  username: string;
  email: string;
  roleId: string;
  roleName: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRequest {
  username: string;
  password?: string;
  email?: string;
  roleId?: string;
  status?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const userApi = {
  list: (params?: { search?: string; roleId?: string; page?: number; limit?: number }) =>
    get<PageResult<UserItem>>('/users', params as Record<string, unknown>),

  getById: (id: string) => get<UserItem>(`/users/${id}`),

  create: (data: UserRequest) => post<UserItem>('/users', data),

  update: (id: string, data: UserRequest) => put<UserItem>(`/users/${id}`, data),

  delete: (id: string) => del(`/users/${id}`),

  updateStatus: (id: string, status: string) => patch<UserItem>(`/users/${id}/status`, { status }),
};
