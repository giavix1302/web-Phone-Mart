/**
 * Order Detail Page
 * Trang chi tiết đơn hàng
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import PaymentMethodBadge from '@/components/orders/PaymentMethodBadge';
import OrderTrackingTimeline from '@/components/orders/OrderTrackingTimeline';
import { useAuth } from '@/hooks/use-auth';
import { orderService } from '@/services/order.service';
import ReviewButton from '@/components/reviews/ReviewButton';
import { ArrowLeftIcon, HomeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import type { Order } from '@/types/order';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/orders/${orderId}`);
    }
  }, [isAuthenticated, authLoading, router, orderId]);

  // Fetch order detail
  useEffect(() => {
    if (!isAuthenticated || !orderId) return;

    setIsLoading(true);
    setError(null);

    orderService
      .getMyOrderById(orderId)
      .then((orderData) => {
        setOrder(orderData);
      })
      .catch((err) => {
        const error = err instanceof Error ? err : new Error('Failed to fetch order');
        setError(error);
        console.error('Error fetching order:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthenticated, orderId]);

  const handleCancelOrder = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.'
    );

    if (!confirmed) return;

    setIsCancelling(true);

    try {
      await orderService.cancelOrder(order.id);
      // Refresh order data
      const updatedOrder = await orderService.getMyOrderById(orderId);
      setOrder(updatedOrder);
    } catch (err: any) {
      console.error('Failed to cancel order:', err);
      alert(err.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReviewSuccess = async () => {
    // Refresh order data to get updated isReviewed status
    if (orderId) {
      try {
        const updatedOrder = await orderService.getMyOrderById(orderId);
        setOrder(updatedOrder);
      } catch (err) {
        console.error('Failed to refresh order after review:', err);
      }
    }
  };

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-[#F5F5F5]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-[#F5F5F5]">
          <div className="container mx-auto px-4 py-8">
            <Card className="p-6 bg-red-50 border-red-200">
              <p className="text-red-700 font-semibold mb-2">Không tìm thấy đơn hàng</p>
              <p className="text-sm text-red-600 mb-4">
                {error?.message || 'Đơn hàng không tồn tại hoặc bạn không có quyền xem.'}
              </p>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Quay lại danh sách đơn hàng
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedCreatedDate = new Date(order.createdAt).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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
            <Link href="/orders" className="hover:text-[#FF4F00] transition-colors">
              Đơn hàng của tôi
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">#{order.orderNumber}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
                Đơn hàng #{order.orderNumber}
              </h1>
              <p className="text-gray-600">Đặt ngày {formattedCreatedDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              {order.status === 'PENDING' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isCancelling
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <TrashIcon className="w-5 h-5" />
                  {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Information */}
              <Card>
                <h2 className="text-xl font-bold text-[#333333] mb-4">Thông tin đơn hàng</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Địa chỉ giao hàng</p>
                    <p className="text-[#333333]">{order.shippingAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Phương thức thanh toán:</p>
                    <PaymentMethodBadge method={order.paymentMethod} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</p>
                    <p
                      className={`font-semibold ${
                        order.paymentStatus === 'PAID'
                          ? 'text-green-600'
                          : order.paymentStatus === 'FAILED'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {order.paymentStatus === 'PAID' && 'Đã thanh toán'}
                      {order.paymentStatus === 'PENDING' && 'Chờ thanh toán'}
                      {order.paymentStatus === 'FAILED' && 'Thanh toán thất bại'}
                      {order.paymentStatus === 'REFUNDED' && 'Đã hoàn tiền'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Order Items */}
              <Card>
                <h2 className="text-xl font-bold text-[#333333] mb-4">Sản phẩm</h2>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const canReview = order.status === 'DELIVERED' && !item.isReviewed;
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                      >
                        <Link
                          href={`/products/${item.productSlug || item.productId}`}
                          className="flex-1"
                        >
                          <p className="font-semibold text-[#333333] hover:text-[#FF4F00] transition-colors">
                            {item.productName}
                          </p>
                          {item.colorName && (
                            <div className="flex items-center gap-2 mt-1">
                              {item.colorHexCode && (
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.colorHexCode }}
                                />
                              )}
                              <span className="text-sm text-gray-600">Màu: {item.colorName}</span>
                            </div>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            Số lượng: {item.quantity} × {item.unitPrice.toLocaleString('vi-VN')} ₫
                          </p>
                        </Link>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-lg font-bold text-[#FF4F00]">
                            {item.subtotal.toLocaleString('vi-VN')} ₫
                          </p>
                          {canReview && (
                            <ReviewButton
                              productId={item.productId}
                              orderItemId={item.id}
                              productName={item.productName}
                              onSuccess={handleReviewSuccess}
                            />
                          )}
                          {item.isReviewed && (
                            <span className="text-xs text-green-600 font-medium">Đã đánh giá</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Tracking Timeline */}
              {order.trackings && order.trackings.length > 0 && (
                <Card>
                  <h2 className="text-xl font-bold text-[#333333] mb-4">Lịch sử vận chuyển</h2>
                  <OrderTrackingTimeline trackings={order.trackings} />
                </Card>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <h2 className="text-xl font-bold text-[#333333] mb-4">Tóm tắt đơn hàng</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Số sản phẩm:</span>
                    <span className="font-semibold">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#333333] pt-3 border-t border-gray-200">
                    <span>Tổng tiền:</span>
                    <span className="text-[#FF4F00]">
                      {order.totalAmount.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>

                <Link
                  href="/orders"
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Quay lại danh sách
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
