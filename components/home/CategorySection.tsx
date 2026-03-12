/**
 * Category Section Component
 * Hiển thị các danh mục sản phẩm từ API - dạng slider 1 hàng
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, TagIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useCategories } from '@/hooks/use-categories';

const GRADIENT_COLORS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-amber-500',
  'from-indigo-500 to-violet-500',
];

const CARD_WIDTH = 280; // px — width of each category card including gap

function CategorySkeleton() {
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function CategorySection() {
  const { categories, loading } = useCategories();
  const [offset, setOffset] = useState(0);

  const VISIBLE = 4;
  const maxOffset = loading ? 0 : Math.max(0, categories.length - VISIBLE);

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  // Auto-play: tự động chạy, quay vòng
  useEffect(() => {
    if (loading || categories.length === 0) return;
    const id = setInterval(() => {
      setOffset((o) => {
        const max = Math.max(0, categories.length - VISIBLE);
        return o >= max ? 0 : o + 1;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [loading, categories.length]);

  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Danh mục sản phẩm
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm sản phẩm phù hợp với nhu cầu của bạn
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
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${offset * CARD_WIDTH}px)` }}
            >
              {loading
                ? [1, 2, 3, 4].map((i) => <CategorySkeleton key={i} />)
                : categories.map((category, index) => {
                    const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
                    return (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.id}`}
                        className="flex-shrink-0 w-64 group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Image / Gradient background */}
                        <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                          {category.imageUrl ? (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <TagIcon className="w-16 h-16 text-white/40 group-hover:scale-110 transition-transform duration-300" />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="text-base font-bold text-[#333333] mb-1 group-hover:text-[#FF4F00] transition-colors">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{category.description}</p>
                          )}
                          <div className="flex items-center text-[#FF4F00] text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300">
                            <span>Xem thêm</span>
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
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
