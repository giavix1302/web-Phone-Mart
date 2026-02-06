/**
 * Review Section Component
 * Hiển thị đánh giá của khách hàng
 */

'use client';

import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const reviews = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: '👤',
    rating: 5,
    comment: 'Sản phẩm chất lượng tốt, giao hàng nhanh. Rất hài lòng với dịch vụ!',
    product: 'iPhone 15 Pro Max',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: '👩',
    rating: 5,
    comment: 'Điện thoại đúng như mô tả, giá cả hợp lý. Nhân viên tư vấn nhiệt tình.',
    product: 'Samsung Galaxy S24',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: '👨',
    rating: 5,
    comment: 'Mua được điện thoại tốt với giá rẻ. Sẽ quay lại mua tiếp!',
    product: 'Xiaomi 14',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    avatar: '👩‍💼',
    rating: 5,
    comment: 'Chất lượng sản phẩm vượt mong đợi. Bảo hành tốt, hỗ trợ nhanh chóng.',
    product: 'Oppo Find X7',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    avatar: '👨‍💻',
    rating: 5,
    comment: 'Điện thoại mới, chính hãng. Giao hàng đúng hẹn, đóng gói cẩn thận.',
    product: 'Vivo X100',
  },
  {
    id: 6,
    name: 'Đỗ Thị F',
    avatar: '👩‍🎓',
    rating: 5,
    comment: 'Rất hài lòng với chất lượng và dịch vụ. Cảm ơn cửa hàng!',
    product: 'Realme GT 5',
  },
];

export default function ReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(reviews.length / 3));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(reviews.length / 3)) % Math.ceil(reviews.length / 3));
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const visibleReviews = reviews.slice(currentIndex * 3, currentIndex * 3 + 3);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm
          </p>
        </div>

        <div className="relative">
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#F5F5F5] rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Rating */}
                <div className="mb-4 text-2xl">
                  {renderStars(review.rating)}
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-4 italic">
                  "{review.comment}"
                </p>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF4F00] to-orange-600 rounded-full flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#333333]">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={prevReview}
              className="p-2 bg-[#F5F5F5] hover:bg-[#FF4F00] hover:text-white rounded-full transition-colors duration-200"
              aria-label="Previous reviews"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-[#FF4F00] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to review page ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="p-2 bg-[#F5F5F5] hover:bg-[#FF4F00] hover:text-white rounded-full transition-colors duration-200"
              aria-label="Next reviews"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
