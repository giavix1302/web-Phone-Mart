/**
 * ReviewCard Component
 * Component hiển thị 1 review
 */

'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/use-auth';
import type { Review } from '@/types/api';

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
}

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const { user } = useAuth();
  const isOwnReview = user?.id === review.userId;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.userAvatarUrl ? (
            <img
              src={review.userAvatarUrl}
              alt={review.userName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#FF4F00] flex items-center justify-center text-white font-semibold">
              {getInitials(review.userName)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-[#333333]">{review.userName}</h4>
              <div className="flex items-center gap-2 mt-1">
                {/* Rating Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
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
                <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
              </div>
            </div>

            {/* Edit/Delete Buttons */}
            {isOwnReview && (onEdit || onDelete) && (
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(review)}
                    className="p-1.5 text-gray-400 hover:text-[#FF4F00] transition-colors"
                    aria-label="Chỉnh sửa đánh giá"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(review.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Xóa đánh giá"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
