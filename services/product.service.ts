/**
 * Product Service
 * Service để gọi API liên quan đến sản phẩm
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { API_CONFIG } from '@/config/api';
import type { Product, ProductImage, ApiResponse, PaginatedResponse } from '@/types/api';

export interface ProductFilters {
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
}

export const productService = {
  /**
   * Lấy danh sách sản phẩm với filters
   */
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    
    // Gửi tất cả filters xuống backend
    if (filters?.brandId) params.append('brandId', filters.brandId.toString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.PRODUCTS}?${queryString}`
      : API_ENDPOINTS.PRODUCTS;

    // Debug: Log request details
    console.log('🌐 [Product Service] Request details:', {
      endpoint: endpoint,
      fullUrl: `${API_CONFIG.BASE_URL}${endpoint}`,
      filters: filters,
      queryParams: Object.fromEntries(params.entries()),
    });

    const response = await apiClient.get<ApiResponse<Product[]>>(endpoint, {
      public: true, // API public, không cần auth
    });

    // Debug: Log response details
    console.log('📡 [Product Service] Response details:', {
      success: response.success,
      message: response.message,
      dataCount: Array.isArray(response.data) ? response.data.length : 'not array',
      data: response.data,
    });

    return response.data;
  },

  /**
   * Lấy sản phẩm theo ID
   */
  getById: async (id: number | string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCT_BY_ID(id.toString()),
      {
        public: true, // API public, không cần auth
      }
    );
    return response.data;
  },

  /**
   * Tạo sản phẩm mới (Admin only)
   */
  create: async (product: {
    name: string;
    description?: string | null;
    price: number;
    discountPrice?: number | null;
    stockQuantity: number;
    categoryId: number;
    brandId: number;
    colorIds: number[];
    specifications?: Array<{ specName: string; specValue: string }>;
  }): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
      body: product,
    });
    return response.data;
  },

  /**
   * Cập nhật sản phẩm (Admin only)
   */
  update: async (
    id: number | string,
    product: {
      name?: string;
      description?: string | null;
      price?: number;
      discountPrice?: number | null;
      stockQuantity?: number;
      isActive?: boolean;
      categoryId?: number;
      brandId?: number;
      colorIds?: number[];
      specifications?: Array<{ specName: string; specValue: string }> | null;
    }
  ): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCT_BY_ID(id.toString()),
      {
        body: product,
      }
    );
    return response.data;
  },

  /**
   * Xóa sản phẩm (Admin only)
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id.toString()));
  },

  /**
   * Lấy danh sách hình ảnh của sản phẩm
   */
  getImages: async (productId: number | string): Promise<ProductImage[]> => {
    const response = await apiClient.get<ApiResponse<ProductImage[]>>(
      API_ENDPOINTS.PRODUCT_IMAGES(productId),
      {
        public: true, // API public, không cần auth
      }
    );
    return response.data;
  },
};
