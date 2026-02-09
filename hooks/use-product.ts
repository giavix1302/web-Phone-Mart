/**
 * useProduct Hook
 * Hook để fetch product by ID
 */

import { useState, useEffect } from 'react';
import { productService } from '@/services/product.service';
import type { Product } from '@/types/api';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProduct(id: number | string | null): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
