/**
 * Brand Section Component
 * Hiển thị các thương hiệu từ API - dạng slider 1 hàng
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useBrands } from '@/hooks/use-brands';

const ITEM_WIDTH = 160; // px — width of each brand card including gap

function BrandSkeleton() {
  return (
    <div className="flex-shrink-0 w-36 flex flex-col items-center justify-center p-6 bg-[#F5F5F5] rounded-2xl animate-pulse">
      <div className="w-14 h-14 bg-gray-300 rounded-full mb-3" />
      <div className="h-3 bg-gray-300 rounded w-16" />
    </div>
  );
}

export default function BrandSection() {
  const { brands, loading } = useBrands();
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = () => {
    if (!containerRef.current) return 6;
    return Math.floor(containerRef.current.offsetWidth / ITEM_WIDTH);
  };

  const maxOffset = loading ? 0 : Math.max(0, brands.length - visibleCount());

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  // Auto-play: tự động chạy, quay vòng
  useEffect(() => {
    if (loading || brands.length === 0) return;
    const id = setInterval(() => {
      setOffset((o) => {
        const max = Math.max(0, brands.length - visibleCount());
        return o >= max ? 0 : o + 1;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [loading, brands.length]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Sản phẩm theo hãng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá điện thoại từ các thương hiệu hàng đầu thế giới
          </p>
        </div>

        <div className="relative">
          {/* Prev button */}
          <button
            onClick={prev}
            disabled={offset === 0}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-[#FF4F00] hover:text-white hover:border-[#FF4F00] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Trước"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {/* Slider viewport */}
          <div ref={containerRef} className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${offset * ITEM_WIDTH}px)` }}
            >
              {loading
                ? [1, 2, 3, 4, 5, 6].map((i) => <BrandSkeleton key={i} />)
                : brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/products?brand=${brand.id}`}
                      className="flex-shrink-0 w-36 flex flex-col items-center justify-center p-6 bg-[#F5F5F5] rounded-2xl cursor-pointer"
                    >
                      <div className="w-14 h-14 mb-3 flex items-center justify-center">
                        {brand.imageUrl ? (
                          <img
                            src={brand.imageUrl}
                            alt={brand.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-500">
                              {brand.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#333333] text-center">
                        {brand.name}
                      </h3>
                    </Link>
                  ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            disabled={offset >= maxOffset}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-[#FF4F00] hover:text-white hover:border-[#FF4F00] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Tiếp theo"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
