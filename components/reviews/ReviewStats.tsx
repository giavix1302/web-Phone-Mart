/**
 * ReviewStats Component
 * Hiển thị thống kê reviews: average rating, rating distribution
 */

'use client';

import type { ReviewStats as ReviewStatsType } from '@/types/api';

interface ReviewStatsProps {
  stats: ReviewStatsType | null;
  loading?: boolean;
}

export default function ReviewStats({ stats, loading = false }: ReviewStatsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <p className="text-gray-500">Chưa có đánh giá nào</p>
      </div>
    );
  }

  const fullStars = Math.floor(stats.averageRating);
  const hasHalfStar = stats.averageRating % 1 >= 0.5;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-[#333333] mb-6">Đánh giá sản phẩm</h2>

      {/* Average Rating */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
        <div className="text-5xl font-bold text-[#FF4F00]">
          {stats.averageRating.toFixed(1)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${
                  star <= fullStars
                    ? 'text-yellow-400 fill-current'
                    : star === fullStars + 1 && hasHalfStar
                    ? 'text-yellow-400 fill-current opacity-50'
                    : 'text-gray-300'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Dựa trên {stats.totalReviews} {stats.totalReviews === 1 ? 'đánh giá' : 'đánh giá'}
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating.toString() as keyof typeof stats.ratingDistribution];
          const percentage = stats.percentageDistribution[rating.toString() as keyof typeof stats.percentageDistribution];
          
          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#FF4F00] h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 w-20 text-right">
                {count} ({percentage.toFixed(0)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
