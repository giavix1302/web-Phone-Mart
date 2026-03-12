'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import CartItem from '@/components/cart/CartItem';
import { toast } from 'sonner';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { productService } from '@/services/product.service';
import { ShoppingBagIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import type { Product } from '@/types/api';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading, error } = useCart();
  const [serverCartProducts, setServerCartProducts] = useState<Map<number, Product>>(new Map());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && cart && cart.items.length > 0) {
      Promise.all(
        cart.items.map(async (item) => {
          try {
            const product = await productService.getById(item.productId);
            return { productId: item.productId, product };
          } catch (error) {
            toast.error('Không thể tải thông tin sản phẩm. Vui lòng thử lại.');
            return { productId: item.productId, product: null };
          }
        })
      ).then((results) => {
        const productMap = new Map<number, Product>();
        results.forEach(({ productId, product }) => {
          if (product) productMap.set(productId, product);
        });
        setServerCartProducts(productMap);
      });
    } else {
      setServerCartProducts(new Map());
    }
  }, [isAuthenticated, cart]);

  const itemsToDisplay = useMemo(() => {
    if (!cart) return [];
    return cart.items.map((item) => ({
      item,
      product: serverCartProducts.get(item.productId) || null,
    }));
  }, [cart, serverCartProducts]);

  const totals = useMemo(() => {
    if (!cart) return { totalAmount: 0, totalItems: 0 };
    return { totalAmount: cart.totalAmount, totalItems: cart.totalItems };
  }, [cart]);

  const handleCheckout = () => {
    router.push('/checkout');
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
              {mounted && isAuthenticated
                ? 'Quản lý các sản phẩm trong giỏ hàng của bạn'
                : 'Đăng nhập để xem giỏ hàng và thanh toán'}
            </p>
          </div>

          {/* Not authenticated */}
          {mounted && !isAuthenticated && (
            <Card className="p-12 text-center">
              <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Bạn chưa đăng nhập
              </h3>
              <p className="text-gray-500 mb-6">
                Vui lòng đăng nhập để xem giỏ hàng của bạn
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e64500] transition-colors font-semibold"
              >
                Đăng nhập
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </Card>
          )}

          {/* Loading State */}
          {mounted && isAuthenticated && isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
            </div>
          )}

          {/* Error State */}
          {mounted && isAuthenticated && error && (
            <Card className="mb-6 p-6 bg-red-50 border-red-200">
              <p className="text-red-700 font-semibold mb-2">Lỗi khi tải giỏ hàng</p>
              <p className="text-sm text-red-600">{error.message}</p>
            </Card>
          )}

          {/* Cart Content */}
          {mounted && isAuthenticated && !isLoading && !error && (
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
                  itemsToDisplay.map(({ item, product }) => (
                    <CartItem
                      key={`${item.productId}-${item.colorId ?? 'no-color'}`}
                      item={item}
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
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[#FF4F00] text-white hover:bg-[#e64500] transition-colors"
                    >
                      Thanh toán
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
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
