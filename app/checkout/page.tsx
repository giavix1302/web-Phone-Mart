/**
 * Checkout Page
 * Trang thanh toán từ giỏ hàng
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { orderService } from '@/services/order.service';
import { userService } from '@/services/user.service';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import type { PaymentMethod } from '@/types/order';
import type { UserProfile } from '@/types/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading, clearCart } = useCart();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load profile to get default address
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingProfile(true);
      userService
        .getMyProfile()
        .then((profileData) => {
          setProfile(profileData);
          if (profileData.address) {
            setShippingAddress(profileData.address);
          }
        })
        .catch((error) => {
          console.error('Failed to load profile:', error);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  }, [isAuthenticated]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cart && cart.items.length === 0) {
      router.push('/cart');
    }
  }, [cart, cartLoading, router]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!shippingAddress.trim()) {
      errors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng';
    } else if (shippingAddress.length > 500) {
      errors.shippingAddress = 'Địa chỉ không được vượt quá 500 ký tự';
    }

    if (!paymentMethod) {
      errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (!cart || cart.items.length === 0) {
      setError('Giỏ hàng của bạn đang trống');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await orderService.createOrder({
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
      });

      // Clear cart after successful order
      await clearCart();

      // Redirect to orders page
      router.push('/orders?success=true');
    } catch (err: any) {
      console.error('Failed to create order:', err);
      if (err.statusCode === 400) {
        setError(err.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại giỏ hàng.');
      } else if (err.statusCode === 401) {
        router.push('/login?redirect=/checkout');
      } else {
        setError('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading or redirect if not ready
  if (authLoading || cartLoading || !isAuthenticated) {
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

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect
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
            <Link href="/cart" className="hover:text-[#FF4F00] transition-colors">
              Giỏ hàng
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Thanh toán</span>
          </nav>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
              Thanh toán
            </h1>
            <p className="text-gray-600">Hoàn tất thông tin để đặt hàng</p>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="mb-6 p-4 bg-red-50 border-red-200">
              <p className="text-red-700 font-semibold">{error}</p>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <Card>
                  <h2 className="text-xl font-bold text-[#333333] mb-4">Địa chỉ giao hàng</h2>
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => {
                        setShippingAddress(e.target.value);
                        if (validationErrors.shippingAddress) {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.shippingAddress;
                            return newErrors;
                          });
                        }
                      }}
                      placeholder="Nhập địa chỉ giao hàng đầy đủ..."
                      rows={4}
                      maxLength={500}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all ${
                        validationErrors.shippingAddress
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {validationErrors.shippingAddress && (
                        <p className="text-sm text-red-600">{validationErrors.shippingAddress}</p>
                      )}
                      <p className="text-sm text-gray-500 ml-auto">
                        {shippingAddress.length}/500
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Payment Method */}
                <Card>
                  <h2 className="text-xl font-bold text-[#333333] mb-4">Phương thức thanh toán</h2>
                  <div className="space-y-3">
                    {(['COD', 'MOMO', 'BANK'] as PaymentMethod[]).map((method) => (
                      <label
                        key={method}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === method
                            ? 'border-[#FF4F00] bg-[#FF4F00]/5'
                            : 'border-gray-300 hover:border-[#FF4F00]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => {
                            setPaymentMethod(e.target.value as PaymentMethod);
                            if (validationErrors.paymentMethod) {
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.paymentMethod;
                                return newErrors;
                              });
                            }
                          }}
                          className="w-5 h-5 text-[#FF4F00] focus:ring-[#FF4F00]"
                          disabled={isSubmitting}
                        />
                        <span className="ml-3 font-medium text-[#333333]">
                          {method === 'COD' && 'Thanh toán khi nhận hàng (COD)'}
                          {method === 'MOMO' && 'Ví MoMo'}
                          {method === 'BANK' && 'Chuyển khoản ngân hàng'}
                        </span>
                      </label>
                    ))}
                    {validationErrors.paymentMethod && (
                      <p className="text-sm text-red-600">{validationErrors.paymentMethod}</p>
                    )}
                  </div>
                </Card>

                {/* Back to Cart */}
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 text-[#FF4F00] hover:text-[#e64500] transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Quay lại giỏ hàng
                </Link>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <h2 className="text-xl font-bold text-[#333333] mb-4">Tóm tắt đơn hàng</h2>

                  {/* Cart Items */}
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#333333]">{item.productName}</p>
                          {item.colorName && (
                            <p className="text-xs text-gray-500">Màu: {item.colorName}</p>
                          )}
                          <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#FF4F00]">
                          {item.totalPrice.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-gray-600">
                      <span>Tổng sản phẩm:</span>
                      <span className="font-semibold">{cart.totalItems}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-[#333333] pt-2">
                      <span>Tổng tiền:</span>
                      <span className="text-[#FF4F00]">
                        {cart.totalAmount.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      'Đặt hàng'
                    )}
                  </button>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
