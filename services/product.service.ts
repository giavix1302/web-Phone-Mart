/**
 * Product Service
 * Service để gọi API liên quan đến sản phẩm
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { Product, ProductImage, ApiResponse, PaginatedProductResponse } from '@/types/api';

export interface ProductFilters {
  search?: string;
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'price' | 'name' | 'rating';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const productService = {
  /**
   * Lấy danh sách sản phẩm với filters
   */
  getAll: async (filters?: ProductFilters): Promise<PaginatedProductResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.brandId) params.append('brandId', filters.brandId.toString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDir) params.append('sortDir', filters.sortDir);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.PRODUCTS}?${queryString}`
      : API_ENDPOINTS.PRODUCTS;

    const response = await apiClient.get<ApiResponse<PaginatedProductResponse>>(endpoint, {
      public: true,
    });

    console.log('[productService.getAll] raw response:', response);

    // API trả về { success, message, data: { items, totalCount, page, ... } }
    const paginatedData = (response as ApiResponse<PaginatedProductResponse>).data;

    console.log('[productService.getAll] paginatedData:', paginatedData);

    if (paginatedData && Array.isArray(paginatedData.items)) {
      return paginatedData;
    }

    // Fallback: nếu response là flat array
    if (Array.isArray(response)) {
      const items = response as unknown as Product[];
      return {
        items,
        totalCount: items.length,
        page: filters?.page ?? 1,
        pageSize: filters?.pageSize ?? 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    console.warn('[productService.getAll] unexpected response format:', response);
    return {
      items: [],
      totalCount: 0,
      page: filters?.page ?? 1,
      pageSize: filters?.pageSize ?? 20,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
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
