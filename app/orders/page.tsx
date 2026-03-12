/**
 * Orders Page
 * Trang danh sách đơn hàng của tôi
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import OrderCard from '@/components/orders/OrderCard';
import { useAuth } from '@/hooks/use-auth';
import { orderService } from '@/services/order.service';
import { ShoppingBagIcon, HomeIcon, ChevronLeftIcon, ChevronRightIcon as ChevronRightOutline } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import type { OrderSummary } from '@/types/order';

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Check for success message from checkout
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      // Remove query param
      router.replace('/orders', { scroll: false });
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch orders
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    orderService
      .getMyOrders(currentPage)
      .then((data) => {
        setOrders(data.items);
        setPagination({
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage,
        });
      })
      .catch((err) => {
        const error = err instanceof Error ? err : new Error('Failed to fetch orders');
        setError(error);
        console.error('Error fetching orders:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthenticated, currentPage]);

  // Show loading or redirect if not ready
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-[#F5F5F5] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <span className="text-gray-900 font-medium">Đơn hàng của tôi</span>
          </nav>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600">Xem và quản lý các đơn hàng của bạn</p>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <Card className="mb-6 p-4 bg-green-50 border-green-200">
              <p className="text-green-700 font-semibold">
                Đặt hàng thành công! Đơn hàng của bạn đã được tạo.
              </p>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Card className="p-6 bg-red-50 border-red-200">
              <p className="text-red-700 font-semibold mb-2">Lỗi khi tải đơn hàng</p>
              <p className="text-sm text-red-600 mb-4">{error.message}</p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  orderService
                    .getMyOrders(currentPage)
                    .then((data) => {
                      setOrders(data.items);
                      setPagination({
                        totalPages: data.totalPages,
                        hasNextPage: data.hasNextPage,
                        hasPreviousPage: data.hasPreviousPage,
                      });
                      setError(null);
                    })
                    .catch((err) => {
                      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !error && orders.length === 0 && (
            <Card className="p-12 text-center">
              <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Bạn chưa có đơn hàng nào
              </h3>
              <p className="text-gray-500 mb-6">
                Hãy mua sắm và tạo đơn hàng đầu tiên của bạn
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e64500] transition-colors font-semibold"
              >
                Xem sản phẩm
              </Link>
            </Card>
          )}

          {/* Orders List */}
          {!isLoading && !error && orders.length > 0 && (
            <>
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="p-2 rounded-lg border border-gray-300 hover:border-[#FF4F00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang trước"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 2)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                            p === currentPage
                              ? 'border-[#FF4F00] bg-[#FF4F00] text-white'
                              : 'border-gray-300 hover:border-[#FF4F00] text-gray-700'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-lg border border-gray-300 hover:border-[#FF4F00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang sau"
                  >
                    <ChevronRightOutline className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
