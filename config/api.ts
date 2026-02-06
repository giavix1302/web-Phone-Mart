/**
 * API Configuration
 * Cấu hình API endpoint và các thiết lập liên quan
 */

export const API_CONFIG = {
  // Base URL của backend API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  
  // Timeout cho các request (milliseconds)
  TIMEOUT: 30000,
  
  // Headers mặc định
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;
