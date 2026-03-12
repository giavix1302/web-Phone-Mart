'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useCart } from '@/hooks/use-cart';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  product?: {
    images?: Array<{ imageUrl: string; isPrimary: boolean }>;
    stockQuantity?: number;
  } | null;
}

export default function CartItem({ item, product }: CartItemProps) {
  const { updateCartItem, removeCartItem, isLoading } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const stockQuantity = product?.stockQuantity;
  const [isAtStock, setIsAtStock] = useState(
    stockQuantity !== undefined && item.quantity >= stockQuantity
  );

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 999) return;
    if (stockQuantity !== undefined && newQuantity > stockQuantity) {
      toast.error(`Chỉ còn ${stockQuantity} sản phẩm trong kho`);
      setIsAtStock(true);
      return;
    }

    setIsAtStock(stockQuantity !== undefined && newQuantity >= stockQuantity);
    setQuantity(newQuantity);
    setIsUpdating(true);
    try {
      await updateCartItem(item.id, newQuantity);
    } catch (error) {
      setQuantity(item.quantity);
      toast.error('Không thể cập nhật số lượng. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeCartItem(item.id);
    } catch (error) {
      toast.error('Không thể xóa sản phẩm. Vui lòng thử lại.');
    }
  };

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
                onClick={() => handleQuantityChange(quantity - 1)}
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
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isUpdating || isLoading || isAtStock}
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
