/**
 * Auth Store
 * Quản lý accessToken trong memory (client-side)
 */

class AuthStore {
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  /**
   * Lấy accessToken hiện tại
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Ưu tiên lấy từ memory, nếu không có thì lấy từ localStorage
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('accessToken');
    }
    
    return this.accessToken;
  }

  /**
   * Lưu accessToken
   */
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  /**
   * Xóa accessToken
   */
  clearToken(): void {
    if (typeof window === 'undefined') return;
    
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Lưu promise của refresh token để tránh gọi nhiều lần cùng lúc
   */
  setRefreshPromise(promise: Promise<string> | null): void {
    this.refreshPromise = promise;
  }

  /**
   * Lấy promise của refresh token đang chạy
   */
  getRefreshPromise(): Promise<string> | null {
    return this.refreshPromise;
  }
}

// Export singleton instance
export const authStore = new AuthStore();
