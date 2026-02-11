/**
 * Cart Types
 * Định nghĩa các types cho cart
 */

// LocalStorage Cart Format
export interface LocalCartItem {
  productId: number;
  colorId?: number; // Optional, bắt buộc nếu product có màu
  quantity: number;
}

export type LocalCart = LocalCartItem[];

// Server Cart Response (từ API)
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  colorId: number | null;
  colorName: string | null;
  colorHexCode: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  id: number;
  userId: number;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Request types
export interface AddCartItemRequest {
  productId: number;
  colorId?: number;
  quantity: number;
}

export interface AddMultipleCartItemsRequest {
  items: AddCartItemRequest[];
}

export interface UpdateCartItemRequest {
  quantity: number;
}
