/**
 * Cart Page
 * Trang hiển thị giỏ hàng
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { cartStore } from '@/lib/cart-store';
import { productService } from '@/services/product.service';
import { ShoppingBagIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import type { LocalCartItem } from '@/types/cart';
import type { Product } from '@/types/api';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading, error } = useCart();
  const [localCartItems, setLocalCartItems] = useState<Array<{
    item: LocalCartItem;
    product: Product | null;
  }>>([]);
  const [loadingLocalCart, setLoadingLocalCart] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only run on client side to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load local cart items when not authenticated
  useEffect(() => {
    if (!isMounted) return;
    
    if (!isAuthenticated) {
      setLoadingLocalCart(true);
      const localCart = cartStore.getLocalCart();
      
      // Fetch product data for each item
      Promise.all(
        localCart.map(async (item) => {
          try {
            const product = await productService.getById(item.productId);
            return { item, product };
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            return { item, product: null };
          }
        })
      ).then((items) => {
        setLocalCartItems(items);
        setLoadingLocalCart(false);
      });
    } else {
      setLocalCartItems([]);
    }
  }, [isAuthenticated, isMounted]);

  // Listen for storage changes to refresh local cart
  useEffect(() => {
    if (!isMounted) return;
    
    if (!isAuthenticated) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'cart') {
          // Reload local cart when it changes
          setLoadingLocalCart(true);
          const localCart = cartStore.getLocalCart();
          Promise.all(
            localCart.map(async (item) => {
              try {
                const product = await productService.getById(item.productId);
                return { item, product };
              } catch (error) {
                console.error(`Failed to fetch product ${item.productId}:`, error);
                return { item, product: null };
              }
            })
          ).then((items) => {
            setLocalCartItems(items);
            setLoadingLocalCart(false);
          });
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isAuthenticated, isMounted]);

  // Also listen for custom event for same-tab updates
  useEffect(() => {
    if (!isMounted) return;
    
    if (!isAuthenticated) {
      const handleCartUpdate = () => {
        setLoadingLocalCart(true);
        const localCart = cartStore.getLocalCart();
        Promise.all(
          localCart.map(async (item) => {
            try {
              const product = await productService.getById(item.productId);
              return { item, product };
            } catch (error) {
              console.error(`Failed to fetch product ${item.productId}:`, error);
              return { item, product: null };
            }
          })
        ).then((items) => {
          setLocalCartItems(items);
          setLoadingLocalCart(false);
        });
      };

      window.addEventListener('cartUpdated', handleCartUpdate);
      return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }
  }, [isAuthenticated, isMounted]);

  // Calculate totals
  const totals = useMemo(() => {
    if (isAuthenticated && cart) {
      return {
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
      };
    } else {
      // Calculate from local cart
      const total = localCartItems.reduce((sum, { item, product }) => {
        if (product) {
          const price = product.discountPrice ?? product.price;
          return sum + price * item.quantity;
        }
        return sum;
      }, 0);
      const totalItems = localCartItems.reduce((sum, { item }) => sum + item.quantity, 0);
      return {
        totalAmount: total,
        totalItems,
      };
    }
  }, [isAuthenticated, cart, localCartItems]);

  // Fetch product data for server cart items to get images
  const [serverCartProducts, setServerCartProducts] = useState<Map<number, Product>>(new Map());

  useEffect(() => {
    if (isAuthenticated && cart && cart.items.length > 0) {
      // Fetch product data for each cart item to get images
      Promise.all(
        cart.items.map(async (item) => {
          try {
            const product = await productService.getById(item.productId);
            return { productId: item.productId, product };
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            return { productId: item.productId, product: null };
          }
        })
      ).then((results) => {
        const productMap = new Map<number, Product>();
        results.forEach(({ productId, product }) => {
          if (product) {
            productMap.set(productId, product);
          }
        });
        setServerCartProducts(productMap);
      });
    } else {
      setServerCartProducts(new Map());
    }
  }, [isAuthenticated, cart]);

  // Get items to display
  const itemsToDisplay = useMemo(() => {
    if (isAuthenticated && cart) {
      return cart.items.map((item) => ({
        type: 'server' as const,
        item,
        product: serverCartProducts.get(item.productId) || null,
      }));
    } else {
      return localCartItems.map(({ item, product }) => {
        if (!product) {
          return null;
        }
        // Convert local cart item to CartItem format for display
        const price = product.discountPrice ?? product.price;
        return {
          type: 'local' as const,
          item: {
            id: item.productId, // Temporary ID
            productId: item.productId,
            productName: product.name,
            productSlug: product.slug,
            colorId: item.colorId ?? null,
            colorName: product.colors.find((c) => c.id === item.colorId)?.colorName ?? null,
            colorHexCode: product.colors.find((c) => c.id === item.colorId)?.hexCode ?? null,
            quantity: item.quantity,
            unitPrice: price,
            totalPrice: price * item.quantity,
          },
          product,
        };
      }).filter((item): item is NonNullable<typeof item> => item !== null);
    }
  }, [isAuthenticated, cart, localCartItems, serverCartProducts]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // TODO: Navigate to checkout page
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5]">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#FF4F00] transition-colors flex items-center gap-1">
              <HomeIcon className="w-4 h-4" />
              Trang chủ
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Giỏ hàng</span>
          </nav>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
              Giỏ hàng của bạn
            </h1>
            <p className="text-gray-600">
              {isMounted && isAuthenticated
                ? 'Quản lý các sản phẩm trong giỏ hàng của bạn'
                : 'Đăng nhập để lưu giỏ hàng và thanh toán'}
            </p>
          </div>

          {/* Loading State */}
          {(isLoading || loadingLocalCart) && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="mb-6 p-6 bg-red-50 border-red-200">
              <p className="text-red-700 font-semibold mb-2">Lỗi khi tải giỏ hàng</p>
              <p className="text-sm text-red-600">{error.message}</p>
            </Card>
          )}

          {/* Cart Content */}
          {!isLoading && !loadingLocalCart && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {itemsToDisplay.length === 0 ? (
                  <Card className="p-12 text-center">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Giỏ hàng của bạn đang trống
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e64500] transition-colors font-semibold"
                    >
                      Xem sản phẩm
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </Card>
                ) : (
                  itemsToDisplay.map(({ item, type, product }) => (
                    <CartItem
                      key={`${item.productId}-${item.colorId ?? 'no-color'}`}
                      item={item}
                      isLocalCart={type === 'local'}
                      product={product}
                    />
                  ))
                )}
              </div>

              {/* Order Summary */}
              {itemsToDisplay.length > 0 && (
                <div className="lg:col-span-1">
                  <Card className="sticky top-24 p-6">
                    <h2 className="text-xl font-bold text-[#333333] mb-4">Tóm tắt đơn hàng</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Tổng sản phẩm:</span>
                        <span className="font-semibold">{totals.totalItems}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-[#333333] pt-4 border-t border-gray-200">
                        <span>Tổng tiền:</span>
                        <span className="text-[#FF4F00]">
                          {totals.totalAmount.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={itemsToDisplay.length === 0}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                        itemsToDisplay.length > 0
                          ? 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isAuthenticated ? 'Thanh toán' : 'Đăng nhập để thanh toán'}
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>

                    {!isAuthenticated && (
                      <p className="mt-4 text-sm text-gray-500 text-center">
                        Vui lòng đăng nhập để tiếp tục thanh toán
                      </p>
                    )}
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
