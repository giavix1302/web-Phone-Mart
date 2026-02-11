/**
 * CartItem Component
 * Hiển thị thông tin một item trong cart
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/hooks/use-cart';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  isLocalCart?: boolean; // Nếu true, item từ localStorage (chưa có đầy đủ thông tin)
  product?: {
    images?: Array<{ imageUrl: string; isPrimary: boolean }>;
  } | null; // Product data để lấy hình ảnh
}

export default function CartItem({ item, isLocalCart = false, product }: CartItemProps) {
  const {
    updateCartItem,
    updateLocalCartItem,
    removeCartItem,
    removeLocalCartItem,
    isLoading,
  } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 999) return; // Max quantity

    setQuantity(newQuantity);

    if (isLocalCart) {
      // Update localStorage cart
      updateLocalCartItem(item.productId, item.colorId ?? undefined, newQuantity);
      return;
    }

    setIsUpdating(true);
    try {
      await updateCartItem(item.id, newQuantity);
    } catch (error) {
      // Revert quantity on error
      setQuantity(item.quantity);
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isLocalCart) {
      // Remove from localStorage cart
      removeLocalCartItem(item.productId, item.colorId ?? undefined);
      return;
    }

    try {
      await removeCartItem(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleDecrease = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    handleQuantityChange(quantity + 1);
  };

  // Get primary image from product data if available
  const primaryImage = product?.images
    ? (product.images.find((img) => img.isPrimary) || product.images[0])?.imageUrl
    : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Product Image */}
        <Link
          href={`/products/${item.productSlug || item.productId}`}
          className="flex-shrink-0 w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden"
        >
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={item.productName}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            {/* Product Name */}
            <Link
              href={`/products/${item.productSlug || item.productId}`}
              className="text-lg font-semibold text-[#333333] hover:text-[#FF4F00] transition-colors mb-2 block"
            >
              {item.productName}
            </Link>

            {/* Color */}
            {item.colorName && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">Màu:</span>
                <div className="flex items-center gap-2">
                  {item.colorHexCode && (
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.colorHexCode }}
                      title={item.colorName}
                    />
                  )}
                  <span className="text-sm text-gray-700">{item.colorName}</span>
                </div>
              </div>
            )}

            {/* Unit Price */}
            <div className="text-sm text-gray-600 mb-2">
              Giá: <span className="font-semibold text-[#FF4F00]">{item.unitPrice.toLocaleString('vi-VN')} ₫</span>
            </div>

            {/* Total Price */}
            <div className="text-lg font-bold text-[#333333]">
              {item.totalPrice.toLocaleString('vi-VN')} ₫
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4 md:flex-col md:items-end">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
              <button
                onClick={handleDecrease}
                disabled={isUpdating || isLoading || quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Giảm số lượng"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max="999"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  handleQuantityChange(value);
                }}
                disabled={isUpdating || isLoading}
                className="w-16 text-center border-0 focus:outline-none focus:ring-0 disabled:bg-transparent"
              />
              <button
                onClick={handleIncrease}
                disabled={isUpdating || isLoading}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Tăng số lượng"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Xóa sản phẩm"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
