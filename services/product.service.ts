/**
 * Product Service
 * Service để gọi API liên quan đến sản phẩm
 */

import { apiClient } from '@/lib/api-client';
import type { Product, ApiResponse, PaginatedResponse } from '@/types/api';

export const productService = {
  /**
   * Lấy danh sách sản phẩm
   */
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data;
  },

  /**
   * Lấy sản phẩm theo ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  /**
   * Tạo sản phẩm mới
   */
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', {
      body: product,
    });
    return response.data;
  },

  /**
   * Cập nhật sản phẩm
   */
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, {
      body: product,
    });
    return response.data;
  },

  /**
   * Xóa sản phẩm
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Lấy danh sách sản phẩm có phân trang
   */
  getPaginated: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      `/products?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
