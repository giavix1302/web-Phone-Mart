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
  PaginatedOrderResponse,
  CreateOrderRequest,
  OrderTracking,
} from '@/types/order';

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
   * Lấy danh sách đơn hàng của tôi (có phân trang)
   */
  getMyOrders: async (page: number = 1, pageSize: number = 10): Promise<PaginatedOrderResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    const response = await apiClient.get<ApiResponse<PaginatedOrderResponse>>(
      `${API_ENDPOINTS.ORDERS_ME}?${params.toString()}`
    );
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
