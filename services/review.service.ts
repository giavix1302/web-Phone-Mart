/**
 * Review Service
 * Service để gọi API liên quan đến reviews
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { Review, ReviewStats, PaginatedReviewResponse, ApiResponse } from '@/types/api';

export interface ReviewFilters {
  rating?: number; // 1-5
  sortBy?: 'createdAt' | 'rating';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface CreateReviewData {
  productId: number;
  orderItemId?: number;
  rating: number; // 1-5
  comment?: string | null;
}

export interface UpdateReviewData {
  rating?: number; // 1-5
  comment?: string | null;
}

export const reviewService = {
  /**
   * Lấy danh sách reviews của sản phẩm (Public)
   */
  getProductReviews: async (
    productId: number | string,
    filters?: ReviewFilters
  ): Promise<PaginatedReviewResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDir) params.append('sortDir', filters.sortDir);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.PRODUCT_REVIEWS(productId)}?${queryString}`
      : API_ENDPOINTS.PRODUCT_REVIEWS(productId);

    const response = await apiClient.get<ApiResponse<PaginatedReviewResponse>>(endpoint, {
      public: true, // Public API
    });

    return response.data;
  },

  /**
   * Lấy thống kê reviews của sản phẩm (Public)
   */
  getProductReviewStats: async (productId: number | string): Promise<ReviewStats> => {
    const response = await apiClient.get<ApiResponse<ReviewStats>>(
      API_ENDPOINTS.PRODUCT_REVIEW_STATS(productId),
      {
        public: true, // Public API
      }
    );
    return response.data;
  },

  /**
   * Tạo review mới (Cần auth)
   */
  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(API_ENDPOINTS.REVIEWS, {
      body: data,
      public: false, // Cần auth
    });
    return response.data;
  },

  /**
   * Cập nhật review (Cần auth)
   */
  updateReview: async (reviewId: number | string, data: UpdateReviewData): Promise<Review> => {
    const response = await apiClient.put<ApiResponse<Review>>(
      API_ENDPOINTS.REVIEW_BY_ID(reviewId),
      {
        body: data,
        public: false, // Cần auth
      }
    );
    return response.data;
  },

  /**
   * Xóa review (Cần auth)
   */
  deleteReview: async (reviewId: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.REVIEW_BY_ID(reviewId), {
      public: false, // Cần auth
    });
  },
};
