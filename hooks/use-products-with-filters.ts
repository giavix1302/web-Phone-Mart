/**
 * Custom Hook: useProductsWithFilters
 * Hook để fetch và quản lý dữ liệu sản phẩm với filters
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { productService, type ProductFilters } from '@/services/product.service';
import type { Product } from '@/types/api';

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function useProductsWithFilters(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Serialize filters để so sánh ổn định, tránh re-fetch khi reference thay đổi nhưng value giống nhau
  const filtersKey = JSON.stringify(filters);
  const prevFiltersKey = useRef<string>('');

  useEffect(() => {
    if (filtersKey === prevFiltersKey.current) return;
    prevFiltersKey.current = filtersKey;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await productService.getAll(filters);

        setProducts(data.items ?? []);
        setPagination({
          page: data.page,
          pageSize: data.pageSize,
          totalCount: data.totalCount,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage,
        });
      } catch (err) {
        const error = err instanceof Error
          ? err
          : new Error('Failed to fetch products');
        setError(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return { products, loading, error, pagination };
}
