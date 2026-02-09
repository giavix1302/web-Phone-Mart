/**
 * Custom Hook: useProductsWithFilters
 * Hook để fetch và quản lý dữ liệu sản phẩm với filters
 */

'use client';

import { useState, useEffect } from 'react';
import { productService, type ProductFilters } from '@/services/product.service';
import type { Product } from '@/types/api';

export function useProductsWithFilters(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Debug: Log filters trước khi gọi API
        console.log('📤 [useProductsWithFilters] Gọi API với filters:', filters);
        
        const data = await productService.getAll(filters);
        
        // Debug: Log response từ API
        console.log('📥 [useProductsWithFilters] Response từ API:', {
          count: data.length,
          data: data,
        });
        
        setProducts(data);
      } catch (err) {
        const error = err instanceof Error 
          ? err 
          : new Error('Failed to fetch products');
        
        // Debug: Log error
        console.error('❌ [useProductsWithFilters] Error:', error);
        
        setError(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error };
}
