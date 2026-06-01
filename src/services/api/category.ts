import { get, post, put, del } from '@/services/request';
import type { PageResult } from './user';

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  productCount?: number;
  sort?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  sort?: number;
}

export const categoryApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    get<PageResult<CategoryItem>>('/categories', params as Record<string, unknown>),

  getById: (id: string) => get<CategoryItem>(`/categories/${id}`),

  create: (data: CategoryRequest) => post<CategoryItem>('/categories', data),

  update: (id: string, data: CategoryRequest) => put<CategoryItem>(`/categories/${id}`, data),

  delete: (id: string) => del(`/categories/${id}`),
};
