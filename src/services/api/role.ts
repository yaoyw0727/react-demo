import { get, post, put, del } from '@/services/request';
import type { PageResult } from './user';

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissionList: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleRequest {
  name: string;
  description?: string;
  permissions?: string[];
  status?: string;
}

export const roleApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    get<PageResult<RoleItem>>('/roles', params as Record<string, unknown>),

  getById: (id: string) => get<RoleItem>(`/roles/${id}`),

  create: (data: RoleRequest) => post<RoleItem>('/roles', data),

  update: (id: string, data: RoleRequest) => put<RoleItem>(`/roles/${id}`, data),

  delete: (id: string) => del(`/roles/${id}`),
};
