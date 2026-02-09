/**
 * useProductReviewStats Hook
 * Hook để fetch review statistics
 */

import { useState, useEffect } from 'react';
import { reviewService } from '@/services/review.service';
import type { ReviewStats } from '@/types/api';

interface UseProductReviewStatsResult {
  stats: ReviewStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProductReviewStats(
  productId: number | string | null
): UseProductReviewStatsResult {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await reviewService.getProductReviewStats(productId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch review stats'));
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [productId]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
