/**
 * Hero Section Component
 * Carousel/Slider với các slide giới thiệu sản phẩm
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const slides = [
  {
    id: 1,
    title: 'Điện thoại chính hãng – Giá tốt mỗi ngày',
    description: 'Khám phá bộ sưu tập điện thoại đa dạng với giá cả hợp lý và chất lượng đảm bảo',
    ctaText: 'Mua ngay',
    ctaLink: '/products',
    image: '/images/hero-iphone.png', // Placeholder - bạn cần thêm ảnh thực tế
    bgGradient: 'from-blue-500 to-purple-600',
  },
  {
    id: 2,
    title: 'Samsung Galaxy – Công nghệ vượt trội',
    description: 'Trải nghiệm công nghệ màn hình AMOLED và camera chuyên nghiệp',
    ctaText: 'Xem sản phẩm',
    ctaLink: '/products?brand=samsung',
    image: '/images/hero-samsung.png',
    bgGradient: 'from-indigo-500 to-blue-600',
  },
  {
    id: 3,
    title: 'Xiaomi – Hiệu năng giá rẻ',
    description: 'Điện thoại thông minh với hiệu năng mạnh mẽ và giá cả phải chăng',
    ctaText: 'Khám phá ngay',
    ctaLink: '/products?brand=xiaomi',
    image: '/images/hero-xiaomi.png',
    bgGradient: 'from-orange-500 to-red-600',
  },
  {
    id: 4,
    title: 'Phụ kiện chính hãng – Bảo vệ thiết bị',
    description: 'Ốp lưng, tai nghe, sạc nhanh và nhiều phụ kiện khác',
    ctaText: 'Xem phụ kiện',
    ctaLink: '/products?category=accessories',
    image: '/images/hero-accessories.png',
    bgGradient: 'from-green-500 to-teal-600',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${slide.bgGradient} flex items-center`}>
              <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div className="text-white space-y-6 z-10">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 max-w-lg">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.ctaLink}
                    className="inline-block px-8 py-4 bg-white text-[#FF4F00] font-bold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {slide.ctaText}
                  </Link>
                </div>

                {/* Right Image */}
                <div className="hidden md:flex justify-center items-center">
                  <div className="relative w-full max-w-md">
                    {/* Placeholder cho ảnh điện thoại */}
                    <div className="w-full h-96 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white/50 text-lg">Hình ảnh {slide.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
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

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
