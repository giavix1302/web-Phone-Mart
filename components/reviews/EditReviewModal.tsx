/**
 * EditReviewModal Component
 * Modal component để edit review với form rating và comment
 */

'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { reviewService } from '@/services/review.service';
import type { Review } from '@/types/api';

interface EditReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditReviewModal({
  review,
  isOpen,
  onClose,
  onSuccess,
}: EditReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with review data when modal opens
  useEffect(() => {
    if (isOpen && review) {
      setRating(review.rating);
      setComment(review.comment || '');
      setHoveredRating(0);
      setError(null);
    }
  }, [isOpen, review]);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }

    // Check if at least one field is provided
    if (rating === review.rating && comment.trim() === (review.comment || '')) {
      setError('Vui lòng thay đổi ít nhất một trường');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updateData: { rating?: number; comment?: string | null } = {};
      
      if (rating !== review.rating) {
        updateData.rating = rating;
      }
      
      if (comment.trim() !== (review.comment || '')) {
        updateData.comment = comment.trim() || null;
      }

      await reviewService.updateReview(review.id, updateData);

      // Call onSuccess callback to refresh reviews
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.message || 'Không thể cập nhật đánh giá. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#333333]">Chỉnh sửa đánh giá</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Đóng"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Product Info */}
          <div className="pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Sản phẩm</p>
            <p className="font-semibold text-[#333333]">{review.productName}</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-[#333333] mb-2">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={loading}
                  className="focus:outline-none disabled:opacity-50"
                  aria-label={`${star} sao`}
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {rating === 1 && 'Rất tệ'}
                  {rating === 2 && 'Tệ'}
                  {rating === 3 && 'Bình thường'}
                  {rating === 4 && 'Tốt'}
                  {rating === 5 && 'Rất tốt'}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="edit-comment" className="block text-sm font-semibold text-[#333333] mb-2">
              Nhận xét (tùy chọn)
            </label>
            <textarea
              id="edit-comment"
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setComment(e.target.value);
                }
              }}
              rows={4}
              maxLength={1000}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all resize-none disabled:opacity-50"
              disabled={loading}
            />
            <div className="mt-1 text-xs text-gray-500 text-right">
              {comment.length}/1000 ký tự
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                loading || rating === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
              }`}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
