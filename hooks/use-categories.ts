/**
 * Custom Hook: useCategories
 * Hook để fetch danh sách categories
 */

'use client';

import { useState, useEffect } from 'react';
import { categoryService } from '@/services/category.service';
import type { Category } from '@/types/api';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        const error = err instanceof Error 
          ? err 
          : new Error('Failed to fetch categories');
        setError(error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
