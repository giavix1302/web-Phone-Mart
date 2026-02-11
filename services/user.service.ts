/**
 * User Service
 * Service để gọi API liên quan đến user profile
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/api';
import type { UserProfile, UpdateProfileRequest } from '@/types/auth';

export const userService = {
  /**
   * Lấy thông tin profile của tôi
   */
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(API_ENDPOINTS.USER_ME);
    return response.data;
  },

  /**
   * Cập nhật profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USER_ME_PROFILE,
      {
        body: data,
      }
    );
    return response.data;
  },

  /**
   * Cập nhật avatar
   */
  updateAvatar: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('avatar', file);

    // Note: apiClient cần hỗ trợ FormData
    // Tạm thời dùng fetch trực tiếp
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      throw new Error('Not authenticated');
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5174/api';
    const response = await fetch(`${baseURL}${API_ENDPOINTS.USER_ME_AVATAR}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      ) as Error & { statusCode?: number; data?: unknown };
      error.statusCode = response.status;
      error.data = errorData;
      throw error;
    }

    const data = await response.json();
    return data.data;
  },
};
