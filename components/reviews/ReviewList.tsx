/**
 * ReviewList Component
 * Hiển thị danh sách reviews với pagination
 */

'use client';

import ReviewCard from './ReviewCard';
import Pagination from './Pagination';
import type { Review } from '@/types/api';

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  } | null;
  onPageChange: (page: number) => void;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
}

export default function ReviewList({
  reviews,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: ReviewListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <p className="text-gray-500">Chưa có đánh giá nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reviews */}
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
