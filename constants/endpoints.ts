/**
 * API Endpoints
 * Định nghĩa các endpoint của API
 */

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCTS_FEATURED: '/products/featured',
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
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_FORGOT_PASSWORD_OTP: '/auth/verify-forgot-password-otp',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/users/me/change-password',
  
  // Reviews
  REVIEWS: '/reviews',
  REVIEWS_TOP: '/reviews/top',
  REVIEW_BY_ID: (reviewId: string | number) => `/reviews/${reviewId}`,
  REVIEWS_ME: '/reviews/me',
  REVIEW_ME_BY_ID: (reviewId: string | number) => `/reviews/me/${reviewId}`,
  PRODUCT_REVIEWS: (productId: string | number) => `/products/${productId}/reviews`,
  PRODUCT_REVIEW_STATS: (productId: string | number) => `/products/${productId}/reviews/stats`,
  
  // Cart
  CART_ME: '/carts/me',
  CART_ITEMS: '/carts/items',
  CART_ITEMS_BATCH: '/carts/items/batch',
  CART_ITEM_BY_ID: (itemId: string | number) => `/carts/items/${itemId}`,
  CART_CLEAR: '/carts/clear',
  
  // Orders
  ORDERS: '/orders',
  ORDERS_ME: '/orders/me',
  ORDER_BY_ID: (orderId: string | number) => `/orders/${orderId}`,
  ORDER_ME_BY_ID: (orderId: string | number) => `/orders/me/${orderId}`,
  ORDER_CANCEL: (orderId: string | number) => `/orders/${orderId}/cancel`,
  ORDER_TRACKING: (orderId: string | number) => `/orders/${orderId}/tracking`,
  
  // User Profile
  USER_ME: '/users/me',
  USER_ME_PROFILE: '/users/me/profile',
  USER_ME_AVATAR: '/users/me/avatar',
} as const;
