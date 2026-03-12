/**
 * ProductInfo Component
 * Hiển thị thông tin sản phẩm: name, brand, price, colors, specs
 */

'use client';

import { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';

import type { Product } from '@/types/api';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedColorId, setSelectedColorId] = useState<number | undefined>(undefined);
  const [isAdding, setIsAdding] = useState(false);

  const hasDiscount = product.discountPercent !== null && product.discountPercent > 0;
  const discountPercent = product.discountPercent ?? 0;
  const finalPrice = hasDiscount
    ? Math.round(product.price * (1 - discountPercent / 100))
    : product.price;

  const hasColors = product.colors && product.colors.length > 0;
  const isColorRequired = hasColors && selectedColorId === undefined;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }

    if (hasColors && !selectedColorId) {
      toast.warning('Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, selectedColorId, 1);
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      {product.brandName && (
        <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brandName}</p>
      )}

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#333333]">{product.name}</h1>

      {/* Rating */}
      {product.averageRating > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(product.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.averageRating.toFixed(1)} ({product.totalReviews} {product.totalReviews === 1 ? 'đánh giá' : 'đánh giá'})
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-[#FF4F00]">
          {finalPrice.toLocaleString('vi-VN')} ₫
        </span>
        {hasDiscount && (
          <>
            <span className="text-xl text-gray-400 line-through">
              {product.price.toLocaleString('vi-VN')} ₫
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {product.stockQuantity > 0 ? (
          <p className="text-green-600 font-medium">
            Còn hàng ({product.stockQuantity} sản phẩm)
          </p>
        ) : (
          <p className="text-red-600 font-medium">Hết hàng</p>
        )}
      </div>

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#333333] mb-3">
            Màu sắc: {selectedColorId && (
              <span className="text-[#FF4F00] font-normal">
                ({product.colors.find((c) => c.id === selectedColorId)?.colorName})
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColorId(color.id)}
                className={`w-10 h-10 rounded-full border-2 transition-colors ${
                  selectedColorId === color.id
                    ? 'border-[#FF4F00] ring-2 ring-[#FF4F00] ring-offset-2'
                    : 'border-gray-300 hover:border-[#FF4F00]'
                }`}
                style={{
                  backgroundColor: color.hexCode || '#ccc',
                }}
                title={color.colorName}
                aria-label={color.colorName}
              />
            ))}
          </div>
          {isColorRequired && (
            <p className="text-sm text-red-600 mt-2">Vui lòng chọn màu sắc</p>
          )}
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div>
          <h3 className="text-sm font-semibold text-[#333333] mb-2">Mô tả:</h3>
          <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
        </div>
      )}

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#333333] mb-3">Thông số kỹ thuật:</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {product.specifications.map((spec) => (
                  <tr key={spec.id}>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700 w-1/3">
                      {spec.specName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{spec.specValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stockQuantity === 0 || isAdding || isLoading || isColorRequired}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
          product.stockQuantity > 0 && !isAdding && !isLoading && !isColorRequired
            ? 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <ShoppingCartIcon className="w-5 h-5" />
        {isAdding || isLoading
          ? 'Đang thêm...'
          : product.stockQuantity > 0
          ? 'Thêm vào giỏ hàng'
          : 'Hết hàng'}
      </button>
    </div>
  );
}
