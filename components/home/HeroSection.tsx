/**
 * Hero Section Component
 * Carousel/Slider hiển thị sản phẩm nổi bật từ API
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/api';

interface FeaturedProduct {
  id: number;
  name: string;
  imageUrl: string | null;
  brandName: string | null;
  categoryName: string | null;
  description: string | null;
  averageRating: number;
  totalReviews: number;
}

const gradients = [
  'from-blue-500 to-purple-600',
  'from-indigo-500 to-blue-600',
  'from-orange-500 to-red-600',
  'from-green-500 to-teal-600',
  'from-pink-500 to-rose-600',
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    apiClient
      .get<ApiResponse<FeaturedProduct[]>>(API_ENDPOINTS.PRODUCTS_FEATURED, { public: true })
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch(() => {
        // Fallback: lấy top 5 sản phẩm từ API chung
        apiClient
          .get<ApiResponse<{ items: Array<{ id: number; name: string; brandName: string | null; categoryName: string | null; description: string | null; averageRating: number; totalReviews: number; images: Array<{ imageUrl: string; isPrimary: boolean }> }> }>>(
            `${API_ENDPOINTS.PRODUCTS}?pageSize=5&sortBy=rating&sortDir=desc`,
            { public: true }
          )
          .then((res) => {
            const items = res.data?.items ?? [];
            if (items.length > 0) {
              setProducts(
                items.map((p) => ({
                  id: p.id,
                  name: p.name,
                  imageUrl: p.images?.find((img) => img.isPrimary)?.imageUrl ?? p.images?.[0]?.imageUrl ?? null,
                  brandName: p.brandName,
                  categoryName: p.categoryName,
                  description: p.description,
                  averageRating: p.averageRating,
                  totalReviews: p.totalReviews,
                }))
              );
            }
          })
          .catch(() => {});
      });
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  // Loading skeleton
  if (products.length === 0) {
    return (
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${gradients[index % gradients.length]} flex items-center`}>
              <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div className="text-white space-y-4 z-10">
                  {product.brandName && (
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                      {product.brandName}
                    </span>
                  )}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {product.name}
                  </h1>
                  {product.description && (
                    <p className="text-lg md:text-xl text-white/90 max-w-lg line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  {product.averageRating > 0 && (
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span>⭐ {product.averageRating.toFixed(1)}</span>
                      <span>({product.totalReviews} đánh giá)</span>
                    </div>
                  )}
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-block px-8 py-4 bg-white text-[#FF4F00] font-bold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Xem sản phẩm
                  </Link>
                </div>

                {/* Right Image */}
                <div className="hidden md:flex justify-center items-center">
                  <div className="relative w-full max-w-md h-96">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority={index === 0}
                        sizes="(max-width: 768px) 0px, 448px"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white/50 text-lg">{product.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {products.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#333333] p-3 rounded-full shadow-lg transition-all duration-200 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#333333] p-3 rounded-full shadow-lg transition-all duration-200 z-20"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75 w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
