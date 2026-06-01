import { get, post, put, del } from '@/services/request';
import type { PageResult } from './user';

export interface ProductItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  stock: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequest {
  name: string;
  categoryId?: string;
  price: number;
  stock: number;
  status?: string;
}

export const productApi = {
  list: (params?: { search?: string; categoryId?: string; status?: string; page?: number; limit?: number }) =>
    get<PageResult<ProductItem>>('/products', params as Record<string, unknown>),

  getById: (id: string) => get<ProductItem>(`/products/${id}`),

  create: (data: ProductRequest) => post<ProductItem>('/products', data),

  update: (id: string, data: ProductRequest) => put<ProductItem>(`/products/${id}`, data),

  delete: (id: string) => del(`/products/${id}`),

  getAllCategories: () => get<{ id: string; name: string }[]>('/products/all-categories'),
};
