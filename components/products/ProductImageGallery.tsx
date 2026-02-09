/**
 * ProductImageGallery Component
 * Image gallery với thumbnail navigation
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/types/api';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  // Sắp xếp: primary image đầu tiên
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return 0;
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = sortedImages[selectedImageIndex] || sortedImages[0];

  if (sortedImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Chưa có hình ảnh</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full max-w-md mx-auto h-[500px] bg-white rounded-lg overflow-hidden">
        {selectedImage ? (
          <Image
            src={selectedImage.imageUrl}
            alt={selectedImage.altText || productName}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Chưa có hình ảnh</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImageIndex
                  ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || `${productName} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
