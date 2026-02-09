/**
 * CreateReviewForm Component
 * Form tạo review với rating và comment
 */

'use client';

import { useState } from 'react';
import { reviewService } from '@/services/review.service';
import { useAuth } from '@/hooks/use-auth';
import type { Product } from '@/types/api';

interface CreateReviewFormProps {
  product: Product;
  onSuccess: () => void;
}

export default function CreateReviewForm({ product, onSuccess }: CreateReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <p className="text-gray-600">
          Vui lòng <a href="/login" className="text-[#FF4F00] hover:underline">đăng nhập</a> để đánh giá sản phẩm
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await reviewService.createReview({
        productId: product.id,
        rating,
        comment: comment.trim() || null,
      });

      setSuccess(true);
      setRating(0);
      setComment('');
      setHoveredRating(0);

      // Call onSuccess callback to refresh reviews
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(
        err?.message || 'Không thể tạo đánh giá. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-[#333333] mb-4">Viết đánh giá</h3>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Đánh giá của bạn đã được gửi thành công!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
                className="focus:outline-none"
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
          <label htmlFor="comment" className="block text-sm font-semibold text-[#333333] mb-2">
            Nhận xét (tùy chọn)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => {
              if (e.target.value.length <= 1000) {
                setComment(e.target.value);
              }
            }}
            rows={4}
            maxLength={1000}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all resize-none"
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {comment.length}/1000 ký tự
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
            loading || rating === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
          }`}
        >
          {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>
    </div>
  );
}
