/**
 * Custom Hook: useBrands
 * Hook để fetch danh sách brands
 */

'use client';

import { useState, useEffect } from 'react';
import { brandService } from '@/services/brand.service';
import type { Brand } from '@/types/api';

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await brandService.getAll();
        setBrands(data);
      } catch (err) {
        const error = err instanceof Error 
          ? err 
          : new Error('Failed to fetch brands');
        setError(error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
}
