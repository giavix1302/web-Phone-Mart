/**
 * Pagination Component
 * Pagination cho reviews
 */

'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages <= maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border border-gray-300 transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Trang trước"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isActive
                  ? 'bg-[#FF4F00] text-white border-[#FF4F00]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border border-gray-300 transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Trang sau"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Page Info */}
      <span className="ml-4 text-sm text-gray-600">
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
}
