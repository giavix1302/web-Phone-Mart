/**
 * Cart Context
 * Context để quản lý cart state (localStorage hoặc server)
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { cartStore } from '@/lib/cart-store';
import { cartService } from '@/services/cart.service';
import { productService } from '@/services/product.service';
import type { Cart, CartItem, LocalCartItem } from '@/types/cart';
import type { Product } from '@/types/api';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: Error | null;
  addToCart: (productId: number, colorId?: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  updateLocalCartItem: (productId: number, colorId: number | undefined, quantity: number) => void;
  removeCartItem: (itemId: number) => Promise<void>;
  removeLocalCartItem: (productId: number, colorId?: number) => void;
  clearCart: () => Promise<void>;
  syncLocalCartToServer: () => Promise<void>;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasSynced, setHasSynced] = useState(false);

  /**
   * Fetch cart từ server
   */
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, không fetch từ server
      setCart(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const serverCart = await cartService.getMyCart();
      setCart(serverCart);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch cart');
      setError(error);
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Sync localStorage cart lên server
   */
  const syncLocalCartToServer = useCallback(async () => {
    if (!isAuthenticated) return;

    const localCart = cartStore.getLocalCart();
    if (localCart.length === 0) {
      setHasSynced(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert localCart items to API format
      const items = localCart.map((item) => ({
        productId: item.productId,
        colorId: item.colorId,
        quantity: item.quantity,
      }));

      // Try batch endpoint first, fallback to individual adds if it fails
      try {
        await cartService.addMultipleItems({ items });
      } catch (batchError: any) {
        // If batch endpoint fails (405, 404, etc.), add items one by one
        if (batchError?.statusCode === 405 || batchError?.statusCode === 404) {
          console.warn('Batch endpoint not available, adding items individually');
          for (const item of items) {
            try {
              await cartService.addItem(item);
            } catch (itemError) {
              console.error(`Failed to add item ${item.productId} to cart:`, itemError);
              // Continue with other items even if one fails
            }
          }
        } else {
          // Re-throw if it's a different error
          throw batchError;
        }
      }

      // Xóa localStorage cart sau khi sync thành công
      cartStore.clearLocalCart();

      // Fetch cart từ server để cập nhật state
      await fetchCart();
      setHasSynced(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sync cart');
      setError(error);
      console.error('Error syncing cart:', error);
      // Don't clear hasSynced flag so we don't retry indefinitely
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  /**
   * Thêm item vào cart
   */
  const addToCart = useCallback(
    async (productId: number, colorId?: number, quantity: number = 1) => {
      if (!isAuthenticated) {
        // Chưa đăng nhập → lưu vào localStorage
        cartStore.addToLocalCart({ productId, colorId, quantity });
        // Trigger re-render bằng cách set cart state (null vì chưa đăng nhập)
        // cartStore.addToLocalCart already dispatches 'cartUpdated' event
        setCart(null);
        return;
      }

      // Đã đăng nhập → gọi API
      setIsLoading(true);
      setError(null);

      try {
        await cartService.addItem({ productId, colorId, quantity });
        // Fetch lại cart để cập nhật state
        await fetchCart();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to add item to cart');
        setError(error);
        console.error('Error adding item to cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, fetchCart]
  );

  /**
   * Cập nhật item trong cart
   */
  const updateCartItem = useCallback(
    async (itemId: number, quantity: number) => {
      if (!isAuthenticated) {
        // Chưa đăng nhập → cập nhật localStorage
        // Cần tìm item trong localStorage cart để cập nhật
        const localCart = cartStore.getLocalCart();
        const item = localCart.find((item) => {
          // Tạm thời không thể map itemId từ server với localStorage
          // Nên chỉ cập nhật khi đã đăng nhập
          return false;
        });
        // TODO: Cần cách khác để map itemId với localStorage items
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await cartService.updateItem(itemId, { quantity });
        await fetchCart();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update cart item');
        setError(error);
        console.error('Error updating cart item:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, fetchCart]
  );

  /**
   * Cập nhật item trong local cart
   */
  const updateLocalCartItem = useCallback(
    (productId: number, colorId: number | undefined, quantity: number) => {
      if (isAuthenticated) return; // Chỉ dùng cho local cart
      cartStore.updateLocalCartItem(productId, colorId, quantity);
      setCart(null); // Trigger re-render
    },
    [isAuthenticated]
  );

  /**
   * Xóa item khỏi cart
   */
  const removeCartItem = useCallback(
    async (itemId: number) => {
      if (!isAuthenticated) {
        // Chưa đăng nhập → xóa khỏi localStorage
        // Tương tự updateCartItem, cần cách khác để map itemId
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await cartService.deleteItem(itemId);
        await fetchCart();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to remove cart item');
        setError(error);
        console.error('Error removing cart item:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, fetchCart]
  );

  /**
   * Xóa item khỏi local cart
   */
  const removeLocalCartItem = useCallback(
    (productId: number, colorId?: number) => {
      if (isAuthenticated) return; // Chỉ dùng cho local cart
      cartStore.removeFromLocalCart(productId, colorId);
      setCart(null); // Trigger re-render
    },
    [isAuthenticated]
  );

  /**
   * Xóa toàn bộ cart
   */
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      cartStore.clearLocalCart();
      setCart(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await cartService.clearCart();
      await fetchCart();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to clear cart');
      setError(error);
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  /**
   * Sync localStorage cart khi đăng nhập
   */
  useEffect(() => {
    if (isAuthenticated && !hasSynced) {
      syncLocalCartToServer();
    }
  }, [isAuthenticated, hasSynced, syncLocalCartToServer]);

  /**
   * Fetch cart khi đăng nhập
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Khi logout, clear cart state
      setCart(null);
      setHasSynced(false);
    }
  }, [isAuthenticated, fetchCart]);

  const value: CartContextType = {
    cart,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    updateLocalCartItem,
    removeCartItem,
    removeLocalCartItem,
    clearCart,
    syncLocalCartToServer,
    refetch: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
