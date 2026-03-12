/**
 * Review Section Component
 * Hiển thị top 10 đánh giá cao nhất từ API
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { reviewService } from '@/services/review.service';
import type { Review } from '@/types/api';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rating ? (
          <StarSolid key={star} className="w-4 h-4 text-yellow-400" />
        ) : (
          <StarIcon key={star} className="w-4 h-4 text-gray-300" />
        )
      )}
    </div>
  );
}

function AvatarFallback({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }
  return (
    <div className="w-12 h-12 bg-gradient-to-br from-[#FF4F00] to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      {initials}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#F5F5F5] rounded-2xl p-6 animate-pulse">
      <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map((i) => <div key={i} className="w-4 h-4 bg-gray-300 rounded" />)}
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-300 rounded w-full" />
        <div className="h-3 bg-gray-300 rounded w-4/5" />
        <div className="h-3 bg-gray-300 rounded w-3/5" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-gray-300 rounded w-24" />
          <div className="h-3 bg-gray-300 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 3;

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    reviewService
      .getTopReviews()
      .then((data) => setReviews(data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const visibleReviews = reviews.slice(currentIndex * PAGE_SIZE, currentIndex * PAGE_SIZE + PAGE_SIZE);

  const next = () => setCurrentIndex((prev) => (prev + 1) % totalPages);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những đánh giá chân thực từ khách hàng đã mua và sử dụng sản phẩm
          </p>
        </div>

        <div className="relative">
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {loading ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : reviews.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-400">
                Chưa có đánh giá nào.
              </div>
            ) : (
              visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#F5F5F5] rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <StarRating rating={review.rating} />

                  <p className="text-gray-700 mb-4 italic flex-grow line-clamp-3">
                    "{review.comment || 'Sản phẩm rất tốt!'}"
                  </p>

                  <div className="flex items-center gap-3">
                    <AvatarFallback name={review.userName} avatarUrl={review.userAvatarUrl} />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#333333] truncate">{review.userName}</h4>
                      <Link
                        href={`/products/${review.productId}`}
                        className="text-sm text-[#FF4F00] hover:underline truncate block"
                      >
                        {review.productName}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Navigation — chỉ hiện khi có nhiều hơn 1 trang */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={prev}
                className="p-2 bg-[#F5F5F5] hover:bg-[#FF4F00] hover:text-white rounded-full transition-colors duration-200"
                aria-label="Previous reviews"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? 'bg-[#FF4F00] w-8'
                        : 'bg-gray-300 hover:bg-gray-400 w-3'
                    }`}
                    aria-label={`Go to review page ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2 bg-[#F5F5F5] hover:bg-[#FF4F00] hover:text-white rounded-full transition-colors duration-200"
                aria-label="Next reviews"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
