/**
 * ProductCard Component
 * Component hiển thị thông tin sản phẩm dạng card
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPercent !== null && product.discountPercent > 0;
  const discountPercent = product.discountPercent ?? 0;
  const finalPrice = hasDiscount
    ? Math.round(product.price * (1 - discountPercent / 100))
    : product.price;

  // Sử dụng images từ product object (đã có sẵn từ API Get All Products)
  const images = product.images || [];
  // Lấy ảnh primary hoặc ảnh đầu tiên
  const primaryImage = images.find(img => img.isPrimary) || images[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
    >
      {/* Image Container */}
      <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
        {primaryImage ? (
          // Hiển thị ảnh từ product object
          <Image
            src={primaryImage.imageUrl}
            alt={primaryImage.altText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          // Placeholder khi không có ảnh
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-400 text-sm">Chưa có hình ảnh</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#FF4F00] text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discountPercent}%
          </div>
        )}

        {/* Stock Badge */}
        {product.stockQuantity === 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Hết hàng
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        {product.brandName && (
          <p className="text-xs text-gray-500 mb-1">{product.brandName}</p>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-[#333333] mb-2 line-clamp-2 group-hover:text-[#FF4F00] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          {product.averageRating && product.averageRating > 0 ? (
            <>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.averageRating!)
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
                ({product.totalReviews || 0} {product.totalReviews === 1 ? 'đánh giá' : 'đánh giá'})
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">Chưa có đánh giá</span>
          )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">Màu:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 5).map((color) => (
                <div
                  key={color.id}
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: color.hexCode || '#ccc',
                  }}
                  title={color.colorName}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-gray-400">+{product.colors.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#FF4F00]">
            {finalPrice.toLocaleString('vi-VN')} ₫
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {product.price.toLocaleString('vi-VN')} ₫
            </span>
          )}
        </div>

      </div>
    </Link>
  );
}
