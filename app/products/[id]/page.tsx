/**
 * Product Detail Page
 * Trang chi tiết sản phẩm với reviews
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ReviewStats from '@/components/reviews/ReviewStats';
import ReviewFilters from '@/components/reviews/ReviewFilters';
import ReviewList from '@/components/reviews/ReviewList';
import CreateReviewForm from '@/components/reviews/CreateReviewForm';
import Card from '@/components/ui/Card';
import { useProduct } from '@/hooks/use-product';
import { useProductReviews } from '@/hooks/use-product-reviews';
import { useProductReviewStats } from '@/hooks/use-product-review-stats';
import type { ReviewFilters as ReviewFiltersType } from '@/services/review.service';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  // Fetch product
  const { product, loading: productLoading, error: productError } = useProduct(productId);

  // Review filters state
  const [reviewFilters, setReviewFilters] = useState<ReviewFiltersType>({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  // Fetch reviews
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    pagination,
    refetch: refetchReviews,
  } = useProductReviews(product?.id || null, reviewFilters);

  // Fetch review stats
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useProductReviewStats(product?.id || null);

  // Handle review filters change
  const handleReviewFiltersChange = (newFilters: ReviewFiltersType) => {
    setReviewFilters(newFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setReviewFilters((prev) => ({ ...prev, page }));
  };

  // Handle review created successfully
  const handleReviewCreated = () => {
    refetchReviews();
    refetchStats();
  };

  // Loading state
  if (productLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-[#F5F5F5]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (productError || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-[#F5F5F5]">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy sản phẩm</h2>
              <p className="text-gray-500 mb-6">
                Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
              <Link
                href="/products"
                className="inline-block px-6 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e64500] transition-colors"
              >
                Quay lại danh sách sản phẩm
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5]">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#FF4F00] transition-colors flex items-center gap-1">
              <HomeIcon className="w-4 h-4" />
              Trang chủ
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <Link href="/products" className="hover:text-[#FF4F00] transition-colors">
              Sản phẩm
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Gallery */}
            <div>
              <ProductImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Product Info */}
            <div>
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Review Stats Section */}
          <div className="mb-8">
            <ReviewStats stats={stats} loading={statsLoading} />
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <Card>
              <div className="space-y-6">
                {/* Filters */}
                <ReviewFilters
                  filters={reviewFilters}
                  onFiltersChange={handleReviewFiltersChange}
                />

                {/* Create Review Form */}
                <CreateReviewForm product={product} onSuccess={handleReviewCreated} />

                {/* Reviews List */}
                {reviewsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-semibold">Lỗi khi tải đánh giá</p>
                    <p className="text-sm mt-1">{reviewsError.message}</p>
                  </div>
                ) : (
                  <ReviewList
                    reviews={reviews}
                    loading={reviewsLoading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
