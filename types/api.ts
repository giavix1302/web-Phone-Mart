/**
 * API Types
 * Định nghĩa các types cho API responses và requests
 */

// Product types theo API docs
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  isActive: boolean;
  categoryId: number | null;
  categoryName: string | null;
  brandId: number | null;
  brandName: string | null;
  colors: ProductColor[];
  specifications: ProductSpecification[];
  images: ProductImage[]; // Images đã có sẵn trong API Get All Products
  averageRating: number; // Điểm đánh giá trung bình (0-5)
  totalReviews: number; // Tổng số lượng review
  createdAt: string;
}

export interface ProductColor {
  id: number;
  colorName: string;
  hexCode: string | null;
}

export interface ProductSpecification {
  id: number;
  specName: string;
  specValue: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Ví dụ: Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Review types
export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatarUrl: string | null;
  productId: number;
  productName: string;
  productSlug: string;
  rating: number; // 1-5
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number; // 0-5, rounded to 2 decimals
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  percentageDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export interface PaginatedReviewResponse {
  items: Review[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
