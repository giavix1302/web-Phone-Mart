/**
 * ReviewFilters Component
 * Filter và sort dropdowns cho reviews
 */

'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { ReviewFilters as ReviewFiltersType } from '@/services/review.service';

interface ReviewFiltersProps {
  filters: ReviewFiltersType;
  onFiltersChange: (filters: ReviewFiltersType) => void;
}

export default function ReviewFilters({ filters, onFiltersChange }: ReviewFiltersProps) {
  const hasActiveFilters = filters.rating !== undefined;

  const handleRatingChange = (value: string) => {
    onFiltersChange({
      ...filters,
      rating: value === '' ? undefined : Number(value),
      page: 1, // Reset to first page when filter changes
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortDir] = value.split('-');
    onFiltersChange({
      ...filters,
      sortBy: sortBy as 'createdAt' | 'rating',
      sortDir: sortDir as 'asc' | 'desc',
      page: 1, // Reset to first page when sort changes
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      rating: undefined,
      page: 1,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Rating Filter */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <select
            value={filters.rating || ''}
            onChange={(e) => handleRatingChange(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all bg-white appearance-none cursor-pointer text-sm"
          >
            <option value="">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Sort */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <select
            value={`${filters.sortBy || 'createdAt'}-${filters.sortDir || 'desc'}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition-all bg-white appearance-none cursor-pointer text-sm"
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="rating-desc">Rating cao nhất</option>
            <option value="rating-asc">Rating thấp nhất</option>
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-[#FF4F00] hover:bg-[#FF4F00]/10 rounded-lg transition-colors font-medium whitespace-nowrap"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
