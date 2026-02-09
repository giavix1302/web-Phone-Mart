/**
 * useProductReviews Hook
 * Hook để fetch reviews với filters, sort, pagination
 */

import { useState, useEffect } from 'react';
import { reviewService, type ReviewFilters } from '@/services/review.service';
import type { Review } from '@/types/api';

interface UseProductReviewsResult {
  reviews: Review[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  } | null;
  refetch: () => Promise<void>;
}

export function useProductReviews(
  productId: number | string | null,
  filters?: ReviewFilters
): UseProductReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<UseProductReviewsResult['pagination']>(null);

  const fetchReviews = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await reviewService.getProductReviews(productId, {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 20,
        rating: filters?.rating,
        sortBy: filters?.sortBy || 'createdAt',
        sortDir: filters?.sortDir || 'desc',
      });
      setReviews(data.items);
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
      setReviews([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, filters?.rating, filters?.sortBy, filters?.sortDir, filters?.page, filters?.pageSize]);

  return {
    reviews,
    loading,
    error,
    pagination,
    refetch: fetchReviews,
  };
}
