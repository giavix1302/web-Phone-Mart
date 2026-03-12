"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "@/hooks/use-auth";
import { cartService } from "@/services/cart.service";
import type { Cart } from "@/types/cart";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: Error | null;
  addToCart: (
    productId: number,
    colorId?: number,
    quantity?: number,
  ) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const serverCart = await cartService.getMyCart();
      setCart(serverCart);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch cart");
      setError(error);
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(
    async (productId: number, colorId?: number, quantity: number = 1) => {
      if (!isAuthenticated) {
        throw new Error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      }

      setIsLoading(true);
      setError(null);

      try {
        await cartService.addItem({ productId, colorId, quantity });
        await fetchCart();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to add item to cart");
        setError(error);
        console.error("Error adding item to cart:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, fetchCart],
  );

  const updateCartItem = useCallback(
    async (itemId: number, quantity: number) => {
      setIsLoading(true);
      setError(null);

      try {
        await cartService.updateItem(itemId, { quantity });
        await fetchCart();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to update cart item");
        setError(error);
        console.error("Error updating cart item:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCart],
  );

  const removeCartItem = useCallback(
    async (itemId: number) => {
      setIsLoading(true);
      setError(null);

      try {
        await cartService.deleteItem(itemId);
        await fetchCart();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to remove cart item");
        setError(error);
        console.error("Error removing cart item:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCart],
  );

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await cartService.clearCart();
      await fetchCart();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to clear cart");
      setError(error);
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, fetchCart]);

  const value: CartContextType = {
    cart,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    refetch: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
