/**
 * Order Types
 * Định nghĩa các types cho order
 */

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'MOMO' | 'BANK';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  colorId: number | null;
  colorName: string | null;
  colorHexCode: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isReviewed?: boolean; // Optional, chỉ có khi backend trả về
}

export interface OrderTracking {
  id: number;
  status: OrderStatus;
  location: string | null;
  description: string;
  note: string | null;
  trackingNumber: string | null;
  shippingPattern: string | null;
  estimatedDelivery: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  trackings: OrderTracking[];
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
}

// Request types
export interface CreateOrderRequest {
  shippingAddress: string;
  paymentMethod: PaymentMethod;
}
