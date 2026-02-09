/**
 * Category Service
 * Service để gọi API liên quan đến category
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { Category, ApiResponse } from '@/types/api';

export const categoryService = {
  /**
   * Lấy danh sách tất cả categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      API_ENDPOINTS.CATEGORIES,
      {
        public: true, // API public, không cần auth
      }
    );
    return response.data;
  },

  /**
   * Lấy category theo ID
   */
  getById: async (id: number | string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORY_BY_ID(id),
      {
        public: true, // API public, không cần auth
      }
    );
    return response.data;
  },
};
