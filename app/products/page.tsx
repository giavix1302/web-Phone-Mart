/**
 * Products Page
 * Trang danh sách sản phẩm với filters
 */

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import Card from '@/components/ui/Card';
import PriceRangeSlider from '@/components/products/PriceRangeSlider';
import { useProductsWithFilters } from '@/hooks/use-products-with-filters';
import { useDebounce } from '@/hooks/use-debounce';
import { useCategories } from '@/hooks/use-categories';
import { useBrands } from '@/hooks/use-brands';
import type { ProductFilters as ProductFiltersType } from '@/services/product.service';
import { FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const priceButtonRef = useRef<HTMLButtonElement>(null);
  const priceModalRef = useRef<HTMLDivElement>(null);
  const { categories, loading: categoriesLoading } = useCategories();
  const { brands, loading: brandsLoading } = useBrands();

  // Lấy filters từ URL params
  const urlFilters = useMemo(() => {
    const brandId = searchParams.get('brand');
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');

    const newFilters: ProductFiltersType = {};
    if (brandId) newFilters.brandId = Number(brandId);
    if (categoryId) newFilters.categoryId = Number(categoryId);
    if (search) newFilters.search = search;

    return newFilters;
  }, [searchParams]);

  // State cho filters (có thể thay đổi từ UI)
  const [filters, setFilters] = useState<ProductFiltersType>(urlFilters);

  // Sync filters với URL params khi URL thay đổi
  useEffect(() => {
    setFilters(urlFilters);
  }, [urlFilters]);

  // Debounce tất cả filters 1 giây trước khi gọi API
  const debouncedFilters = useDebounce(filters, 1000);
  const [isFiltering, setIsFiltering] = useState(false);

  // Set isFiltering = true ngay khi filters thay đổi
  useEffect(() => {
    setIsFiltering(true);
  }, [filters]);

  // Set isFiltering = false khi debounced filters bắt kịp
  useEffect(() => {
    setIsFiltering(false);
  }, [debouncedFilters]);

  // Gửi tất cả filters xuống backend (bao gồm cả minPrice và maxPrice)
  const { products, loading, error, pagination } = useProductsWithFilters(debouncedFilters);


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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5]">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
              Danh sách sản phẩm
            </h1>
            <p className="text-gray-600">
              Tìm kiếm và lọc sản phẩm theo nhu cầu của bạn
            </p>
          </div>

          {/* Filters and Sort Bar - Single Row */}
          <Card className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              {/* Filters Section */}
              <div className="flex-1 flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search || ''}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Price Range - Button with Modal */}
                <div className="flex-1 min-w-[200px] relative">
                  <button
                    ref={priceButtonRef}
                    onClick={() => setIsPriceModalOpen(!isPriceModalOpen)}
                    className={`w-full px-4 py-2 border-2 rounded-lg transition-all text-left flex items-center justify-between text-sm ${
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
                          <h4 className="font-semibold text-[#333333] text-sm">Chọn khoảng giá</h4>
                          <button
                            onClick={() => setIsPriceModalOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Đóng"
                          >
                            <XMarkIcon className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        <PriceRangeSlider
                          min={0}
                          max={50000000}
                          minValue={filters.minPrice}
                          maxValue={filters.maxPrice}
                          onChange={(min, max) => {
                            setFilters({
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

                {/* Brand Dropdown */}
                <div className="min-w-[150px]">
                  <div className="relative">
                    {brandsLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF4F00]"></div>
                      </div>
                    ) : (
                      <>
                        <select
                          value={filters.brandId || ''}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              brandId: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all bg-white appearance-none cursor-pointer text-sm"
                        >
                          <option value="">Tất cả thương hiệu</option>
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </>
                    )}
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="min-w-[150px]">
                  <div className="relative">
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF4F00]"></div>
                      </div>
                    ) : (
                      <>
                        <select
                          value={filters.categoryId || ''}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              categoryId: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all bg-white appearance-none cursor-pointer text-sm"
                        >
                          <option value="">Tất cả danh mục</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </>
                    )}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={() => setFilters({})}
                  disabled={Object.keys(filters).length === 0}
                  className="px-4 py-2 text-sm rounded-lg transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed text-[#FF4F00] hover:bg-[#FF4F00]/10 disabled:hover:bg-transparent"
                >
                  Xóa bộ lọc
                </button>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-4">
                <label className="text-sm text-gray-600 whitespace-nowrap">Sắp xếp:</label>
                <select
                  value={`${filters.sortBy ?? 'createdAt'}-${filters.sortDir ?? 'desc'}`}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'price-asc') setFilters({ ...filters, sortBy: 'price', sortDir: 'asc' });
                    else if (val === 'price-desc') setFilters({ ...filters, sortBy: 'price', sortDir: 'desc' });
                    else if (val === 'name-asc') setFilters({ ...filters, sortBy: 'name', sortDir: 'asc' });
                    else if (val === 'rating-desc') setFilters({ ...filters, sortBy: 'rating', sortDir: 'desc' });
                    else setFilters({ ...filters, sortBy: 'createdAt', sortDir: 'desc' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] text-sm"
                >
                  <option value="createdAt-desc">Mới nhất</option>
                  <option value="name-asc">Tên A-Z</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="rating-desc">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Products Grid */}
          <div className="relative">

              {/* Loading State - Initial load */}
              {loading && products.length === 0 && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                  <p className="font-semibold text-lg mb-2">Lỗi khi tải sản phẩm</p>
                  <p className="text-sm mb-4 whitespace-pre-line">{error.message}</p>
                  {'isNetworkError' in error && (error as { isNetworkError?: boolean }).isNetworkError && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                      <p className="text-sm font-semibold mb-2">Gợi ý khắc phục:</p>
                      <ul className="text-sm list-disc list-inside space-y-1 text-gray-700">
                        <li>Kiểm tra xem backend server có đang chạy không</li>
                        <li>Kiểm tra biến môi trường NEXT_PUBLIC_API_URL trong file .env.local</li>
                        <li>Kiểm tra cấu hình CORS trên backend</li>
                        <li>Kiểm tra kết nối mạng</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && products.length === 0 && (
                <div className="bg-white rounded-lg p-12 text-center">
                  <FunnelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Thử thay đổi bộ lọc để tìm thêm sản phẩm
                  </p>
                  <button
                    onClick={() => setFilters({})}
                    className="px-6 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e64500] transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Loading overlay khi đang filter (có products cũ) */}
              {(loading || isFiltering) && products.length > 0 && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
                </div>
              )}
          </div>

          {/* Pagination */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                disabled={!pagination.hasPreviousPage}
                className="p-2 rounded-lg border border-gray-300 hover:border-[#FF4F00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Trang trước"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 2)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setFilters({ ...filters, page: p as number })}
                      className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                        p === pagination.page
                          ? 'border-[#FF4F00] bg-[#FF4F00] text-white'
                          : 'border-gray-300 hover:border-[#FF4F00] text-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-lg border border-gray-300 hover:border-[#FF4F00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Trang sau"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
