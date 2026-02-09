/**
 * API Endpoints
 * Định nghĩa các endpoint của API
 */

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  PRODUCT_IMAGES: (productId: string | number) => `/products/${productId}/images`,
  PRODUCT_IMAGE_BY_ID: (productId: string | number, imageId: string | number) => `/products/${productId}/images/${imageId}`,
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: string | number) => `/categories/${id}`,
  
  // Brands
  BRANDS: '/brands',
  BRAND_BY_ID: (id: string | number) => `/brands/${id}`,
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_REGISTER_OTP: '/auth/verify-register-otp',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Reviews
  REVIEWS: '/reviews',
  REVIEW_BY_ID: (reviewId: string | number) => `/reviews/${reviewId}`,
  PRODUCT_REVIEWS: (productId: string | number) => `/products/${productId}/reviews`,
  PRODUCT_REVIEW_STATS: (productId: string | number) => `/products/${productId}/reviews/stats`,
} as const;
