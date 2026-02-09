/**
 * Brand Service
 * Service để gọi API liên quan đến brand
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { Brand, ApiResponse } from '@/types/api';

export const brandService = {
  /**
   * Lấy danh sách tất cả brands
   */
  getAll: async (): Promise<Brand[]> => {
    const response = await apiClient.get<ApiResponse<Brand[]>>(
      API_ENDPOINTS.BRANDS,
      {
        public: true, // API public, không cần auth
      }
    );
    return response.data;
  },

  /**
   * Lấy brand theo ID
   */
  getById: async (id: number | string): Promise<Brand> => {
    const response = await apiClient.get<ApiResponse<Brand>>(
      API_ENDPOINTS.BRAND_BY_ID(id),
      {
        public: true, // API public, không cần auth
      }
    );
    return response.data;
  },
};
