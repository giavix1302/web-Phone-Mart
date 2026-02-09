/**
 * API Client
 * Client để gọi API đến backend bên ngoài
 * Hỗ trợ tự động refresh token khi hết hạn
 */

import { API_CONFIG } from '@/config/api';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { authStore } from './auth-store';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  /**
   * Nếu true, API này là public và không cần Bearer token
   * @default false
   */
  public?: boolean;
  /**
   * Nếu true, không tự động retry khi 401 (dùng cho refresh token endpoint)
   * @default false
   */
  skipAuthRetry?: boolean;
};

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Refresh access token bằng refreshToken từ cookie
   */
  private async refreshAccessToken(): Promise<string> {
    // Kiểm tra xem đã có promise refresh đang chạy chưa
    const existingPromise = authStore.getRefreshPromise();
    if (existingPromise) {
      return existingPromise;
    }

    // Tạo promise mới để refresh token
    const refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
          method: 'POST',
          credentials: 'include', // Quan trọng: để gửi cookie refreshToken
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Refresh token cũng hết hạn hoặc không hợp lệ
          authStore.clearToken();
          throw new Error('Refresh token expired or invalid');
        }

        const data = await response.json();
        if (data.success && data.data?.accessToken) {
          const newAccessToken = data.data.accessToken;
          authStore.setToken(newAccessToken);
          return newAccessToken;
        }

        throw new Error('Failed to refresh token');
      } catch (error) {
        authStore.clearToken();
        throw error;
      } finally {
        // Xóa promise sau khi hoàn thành
        authStore.setRefreshPromise(null);
      }
    })();

    // Lưu promise để tránh gọi nhiều lần
    authStore.setRefreshPromise(refreshPromise);
    return refreshPromise;
  }

  /**
   * Thực hiện request với retry logic khi token hết hạn
   */
  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestOptions = {},
    retryCount = 0
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      cache = 'no-store',
      public: isPublic = false,
      skipAuthRetry = false,
    } = options;

    const url = `${this.baseURL}${endpoint}`;

    // Lấy accessToken nếu không phải public API
    const accessToken = !isPublic ? authStore.getToken() : null;

    const config: RequestInit = {
      method,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...headers,
      },
      // Chỉ dùng credentials cho protected API (cần cookie refreshToken)
      // Public API không cần credentials để tránh CORS preflight OPTIONS request
      credentials: isPublic ? 'omit' : 'include',
      cache,
    };

    // Thêm Bearer token nếu có và không phải public API
    if (accessToken && !isPublic) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      // Nếu 401 và chưa retry, thử refresh token
      if (response.status === 401 && !isPublic && !skipAuthRetry && retryCount === 0) {
        try {
          // Refresh token
          await this.refreshAccessToken();
          
          // Retry request với token mới
          return this.requestWithRetry<T>(endpoint, options, retryCount + 1);
        } catch {
          // Refresh token thất bại, throw error
          throw new Error('Authentication failed. Please login again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `API Error: ${response.status} ${response.statusText}`
        ) as Error & { statusCode?: number; data?: unknown };
        error.statusCode = response.status;
        error.data = errorData;
        throw error;
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      // Xử lý các loại lỗi khác nhau
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // Network error hoặc CORS error
        const networkError = new Error(
          `Không thể kết nối đến server. Vui lòng kiểm tra:\n` +
          `1. Server có đang chạy không?\n` +
          `2. URL API có đúng không? (${url})\n` +
          `3. CORS đã được cấu hình đúng chưa?`
        ) as Error & { 
          statusCode?: number; 
          data?: unknown;
          isNetworkError?: boolean;
        };
        networkError.statusCode = 0;
        networkError.isNetworkError = true;
        console.error('Network Error:', {
          url,
          baseURL: this.baseURL,
          endpoint,
          error: error.message,
        });
        throw networkError;
      }
      
      // Nếu error đã có statusCode thì giữ nguyên
      if (error instanceof Error && 'statusCode' in error) {
        const errorWithStatusCode = error as Error & { statusCode: number };
        console.error('API Request failed:', {
          url,
          statusCode: errorWithStatusCode.statusCode,
          message: error.message,
        });
        throw error;
      }
      
      // Lỗi khác
      console.error('API Request failed:', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.requestWithRetry<T>(endpoint, options);
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'POST' });
  }

  put<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PUT' });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  patch<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
