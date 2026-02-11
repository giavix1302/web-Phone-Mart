/**
 * Cart Store
 * Quản lý cart trong localStorage
 */

import type { LocalCart, LocalCartItem } from '@/types/cart';

const CART_STORAGE_KEY = 'cart';

class CartStore {
  /**
   * Lấy cart từ localStorage
   * Safe for SSR - returns empty array on server
   */
  getLocalCart(): LocalCart {
    if (typeof window === 'undefined') return [];
    
    try {
      const cartJson = localStorage.getItem(CART_STORAGE_KEY);
      if (!cartJson) return [];
      
      const cart = JSON.parse(cartJson) as LocalCart;
      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  }

  /**
   * Lưu cart vào localStorage
   */
  private setLocalCart(cart: LocalCart): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  /**
   * Thêm item vào localStorage cart
   * Nếu item đã tồn tại (cùng productId và colorId) → cộng dồn quantity
   */
  addToLocalCart(item: LocalCartItem): void {
    const cart = this.getLocalCart();
    
    // Tìm item có cùng productId và colorId
    const existingIndex = cart.findIndex(
      (cartItem) =>
        cartItem.productId === item.productId &&
        (cartItem.colorId === item.colorId || 
         (cartItem.colorId === undefined && item.colorId === undefined))
    );

    if (existingIndex >= 0) {
      // Cộng dồn quantity
      cart[existingIndex].quantity += item.quantity;
    } else {
      // Thêm item mới
      cart.push(item);
    }

    this.setLocalCart(cart);
    // Dispatch custom event for same-tab updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }

  /**
   * Cập nhật item trong localStorage cart
   */
  updateLocalCartItem(productId: number, colorId: number | undefined, quantity: number): void {
    const cart = this.getLocalCart();
    
    const index = cart.findIndex(
      (item) =>
        item.productId === productId &&
        (item.colorId === colorId || 
         (item.colorId === undefined && colorId === undefined))
    );

    if (index >= 0) {
      cart[index].quantity = quantity;
      this.setLocalCart(cart);
      // Dispatch custom event for same-tab updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    }
  }

  /**
   * Xóa item khỏi localStorage cart
   */
  removeFromLocalCart(productId: number, colorId?: number): void {
    const cart = this.getLocalCart();
    
    const filteredCart = cart.filter(
      (item) =>
        !(item.productId === productId &&
          (item.colorId === colorId || 
           (item.colorId === undefined && colorId === undefined)))
    );

    this.setLocalCart(filteredCart);
    // Dispatch custom event for same-tab updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }

  /**
   * Xóa toàn bộ cart
   */
  clearLocalCart(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  /**
   * Đếm tổng số items trong cart
   * Safe for SSR - returns 0 on server
   */
  getLocalCartItemCount(): number {
    if (typeof window === 'undefined') return 0;
    const cart = this.getLocalCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Export singleton instance
export const cartStore = new CartStore();
