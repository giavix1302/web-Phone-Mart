/**
 * ProductFilters Component
 * Component filter sidebar hiện đại cho danh sách sản phẩm
 */

'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { XMarkIcon, FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useCategories } from '@/hooks/use-categories';
import { useBrands } from '@/hooks/use-brands';
import Card from '@/components/ui/Card';
import PriceRangeSlider from './PriceRangeSlider';
import type { ProductFilters as ProductFiltersType } from '@/services/product.service';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  priceRange?: { min: number; max: number };
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  priceRange = { min: 0, max: 50000000 }, // Default range: 0 - 50 triệu
}: ProductFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const priceButtonRef = useRef<HTMLButtonElement>(null);
  const priceModalRef = useRef<HTMLDivElement>(null);
  // Local state cho search để tránh mất focus khi re-render
  const [searchValue, setSearchValue] = useState(() => filters.search || '');
  const { categories, loading: categoriesLoading } = useCategories();
  const { brands, loading: brandsLoading } = useBrands();

  const handleFilterChange = useCallback((key: keyof ProductFiltersType, value: string | number | boolean | null | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' || value === null || value === undefined ? undefined : value,
    });
  }, [filters, onFiltersChange]);

  // Handle search change - update filters ngay (sẽ được debounce ở parent)
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    handleFilterChange('search', value || undefined);
  }, [handleFilterChange]);

  const clearFilters = useCallback(() => {
    setSearchValue('');
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).length;
  }, [filters]);

  // Check if price filter is active
  const hasPriceFilter = filters.minPrice !== undefined || filters.maxPrice !== undefined;

  // Format price range for button display
  const priceRangeDisplay = useMemo(() => {
    if (!hasPriceFilter) return 'Khoảng giá';
    const min = filters.minPrice ? filters.minPrice.toLocaleString('vi-VN') : '0';
    const max = filters.maxPrice ? filters.maxPrice.toLocaleString('vi-VN') : '50.000.000';
    return `${min} ₫ - ${max} ₫`;
  }, [hasPriceFilter, filters.minPrice, filters.maxPrice]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPriceModalOpen &&
        priceModalRef.current &&
        priceButtonRef.current &&
        !priceModalRef.current.contains(event.target as Node) &&
        !priceButtonRef.current.contains(event.target as Node)
      ) {
        setIsPriceModalOpen(false);
      }
    };

    if (isPriceModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPriceModalOpen]);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-30 bg-[#FF4F00] text-white p-4 rounded-full shadow-lg hover:bg-[#e64500] transition-colors"
        aria-label="Open filters"
      >
        <FunnelIcon className="w-6 h-6" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-20 lg:top-0 h-[calc(100vh-5rem)] lg:h-auto
          w-80 p-4 lg:p-6
          overflow-y-auto z-30 bg-gray-50 lg:bg-transparent
          transform transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-300 bg-white rounded-t-lg p-4 -mx-4 -mt-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#333333]">Bộ lọc</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <Card className="shadow-lg border-2 border-gray-100">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
              <h3 className="text-xl font-bold text-[#333333]">Bộ lọc</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#FF4F00] hover:underline font-semibold transition-colors px-2 py-1 rounded hover:bg-[#FF4F00]/10"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-3">
                Tìm kiếm
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Price Range - Button with Modal */}
            <div className="relative">
              <label className="block text-sm font-semibold text-[#333333] mb-3">
                Khoảng giá
              </label>
              <button
                ref={priceButtonRef}
                onClick={() => setIsPriceModalOpen(!isPriceModalOpen)}
                className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all text-left flex items-center justify-between ${
                  hasPriceFilter
                    ? 'border-[#FF4F00] bg-[#FF4F00]/5 text-[#FF4F00]'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-[#FF4F00]'
                }`}
              >
                <span className={hasPriceFilter ? 'font-semibold' : ''}>
                  {priceRangeDisplay}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    isPriceModalOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Price Modal */}
              {isPriceModalOpen && (
                <>
                  {/* Overlay */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsPriceModalOpen(false)}
                  />
                  {/* Modal Content */}
                  <div
                    ref={priceModalRef}
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-[#333333]">Chọn khoảng giá</h4>
                      <button
                        onClick={() => setIsPriceModalOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Đóng"
                      >
                        <XMarkIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <PriceRangeSlider
                      min={priceRange.min}
                      max={priceRange.max}
                      minValue={filters.minPrice}
                      maxValue={filters.maxPrice}
                      onChange={(min, max) => {
                        onFiltersChange({
                          ...filters,
                          minPrice: min,
                          maxPrice: max,
                        });
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Brand Filter - Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-3">
                Thương hiệu
              </label>
              {brandsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF4F00]"></div>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={filters.brandId || ''}
                    onChange={(e) =>
                      handleFilterChange('brandId', e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Category Filter - Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-3">
                Danh mục
              </label>
              {categoriesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF4F00]"></div>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={filters.categoryId || ''}
                    onChange={(e) =>
                      handleFilterChange('categoryId', e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        </Card>
      </aside>
    </>
  );
}
