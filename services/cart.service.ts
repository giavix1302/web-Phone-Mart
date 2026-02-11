/**
 * Cart Service
 * Service để gọi API liên quan đến cart
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/api';
import type {
  Cart,
  CartItem,
  AddCartItemRequest,
  AddMultipleCartItemsRequest,
  UpdateCartItemRequest,
} from '@/types/cart';

export const cartService = {
  /**
   * Lấy cart của user hiện tại
   */
  getMyCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>(API_ENDPOINTS.CART_ME);
    return response.data;
  },

  /**
   * Thêm item vào cart
   */
  addItem: async (item: AddCartItemRequest): Promise<CartItem> => {
    const response = await apiClient.post<ApiResponse<CartItem>>(API_ENDPOINTS.CART_ITEMS, {
      body: item,
    });
    return response.data;
  },

  /**
   * Thêm nhiều items vào cart
   */
  addMultipleItems: async (request: AddMultipleCartItemsRequest): Promise<CartItem[]> => {
    const response = await apiClient.post<ApiResponse<CartItem[]>>(
      API_ENDPOINTS.CART_ITEMS_BATCH,
      {
        body: request,
      }
    );
    return response.data;
  },

  /**
   * Cập nhật item trong cart
   */
  updateItem: async (itemId: number, request: UpdateCartItemRequest): Promise<CartItem> => {
    const response = await apiClient.put<ApiResponse<CartItem>>(
      API_ENDPOINTS.CART_ITEM_BY_ID(itemId),
      {
        body: request,
      }
    );
    return response.data;
  },

  /**
   * Xóa item khỏi cart
   */
  deleteItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CART_ITEM_BY_ID(itemId));
  },

  /**
   * Xóa toàn bộ cart
   */
  clearCart: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CART_CLEAR);
  },
};
