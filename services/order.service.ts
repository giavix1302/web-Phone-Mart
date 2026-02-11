/**
 * Order Service
 * Service để gọi API liên quan đến orders
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/api';
import type {
  Order,
  OrderSummary,
  CreateOrderRequest,
} from '@/types/order';
import type { OrderTracking } from '@/types/order';

export const orderService = {
  /**
   * Tạo đơn hàng từ giỏ hàng
   */
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS, {
      body: request,
    });
    return response.data;
  },

  /**
   * Lấy danh sách đơn hàng của tôi
   */
  getMyOrders: async (): Promise<OrderSummary[]> => {
    const response = await apiClient.get<ApiResponse<OrderSummary[]>>(API_ENDPOINTS.ORDERS_ME);
    return response.data;
  },

  /**
   * Lấy chi tiết đơn hàng của tôi
   */
  getMyOrderById: async (orderId: number | string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDER_ME_BY_ID(orderId)
    );
    return response.data;
  },

  /**
   * Hủy đơn hàng
   */
  cancelOrder: async (orderId: number | string): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.ORDER_CANCEL(orderId));
  },

  /**
   * Lấy thông tin tracking đơn hàng
   */
  getOrderTracking: async (orderId: number | string): Promise<OrderTracking[]> => {
    const response = await apiClient.get<ApiResponse<OrderTracking[]>>(
      API_ENDPOINTS.ORDER_TRACKING(orderId)
    );
    return response.data;
  },
};
