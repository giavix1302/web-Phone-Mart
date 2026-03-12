/**
 * Auth Service
 * Service để gọi API liên quan đến authentication
 */

import { apiClient } from '@/lib/api-client';
import { authStore } from '@/lib/auth-store';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyRegisterOtpRequest,
  VerifyRegisterOtpResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  VerifyForgotPasswordOtpRequest,
  VerifyForgotPasswordOtpResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '@/types/api';

export const authService = {
  /**
   * Đăng ký tài khoản mới
   * Gửi OTP đến email
   */
  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.REGISTER, {
      body: data,
      public: true, // API public, không cần auth
    });
  },

  /**
   * Xác thực OTP và hoàn tất đăng ký
   * Trả về accessToken sau khi verify thành công
   */
  verifyRegisterOtp: async (
    data: VerifyRegisterOtpRequest
  ): Promise<string> => {
    const response = await apiClient.post<ApiResponse<VerifyRegisterOtpResponse>>(
      API_ENDPOINTS.VERIFY_REGISTER_OTP,
      {
        body: data,
        public: true, // API public, không cần auth
      }
    );

    // Lưu accessToken
    if (response.data?.accessToken) {
      authStore.setToken(response.data.accessToken);
    }

    return response.data.accessToken;
  },

  /**
   * Đăng nhập
   * Trả về accessToken và user info
   * RefreshToken được tự động set vào cookie (HttpOnly)
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Login cần credentials: 'include' để nhận cookie refreshToken
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.LOGIN,
      {
        body: data,
        public: true, // API public, không cần Bearer token nhưng cần credentials để nhận cookie
      }
    );

    // Lưu accessToken
    if (response.data?.accessToken) {
      authStore.setToken(response.data.accessToken);
    }

    return response.data;
  },

  /**
   * Đăng xuất
   * Xóa refreshToken cookie và accessToken
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.LOGOUT, {
        // API này cần auth, sẽ tự động thêm Bearer token
      });
    } finally {
      // Luôn xóa token dù API có thành công hay không
      authStore.clearToken();
    }
  },

  /**
   * Gửi OTP quên mật khẩu đến email
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.FORGOT_PASSWORD, {
      body: data,
      public: true,
    });
  },

  /**
   * Xác thực OTP quên mật khẩu → nhận resetToken
   */
  verifyForgotPasswordOtp: async (
    data: VerifyForgotPasswordOtpRequest
  ): Promise<string> => {
    const response = await apiClient.post<ApiResponse<VerifyForgotPasswordOtpResponse>>(
      API_ENDPOINTS.VERIFY_FORGOT_PASSWORD_OTP,
      { body: data, public: true }
    );
    return response.data.resetToken;
  },

  /**
   * Đặt lại mật khẩu bằng resetToken
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.RESET_PASSWORD, {
      body: data,
      public: true,
    });
  },

  /**
   * Đổi mật khẩu khi đã đăng nhập (cần Bearer token)
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.CHANGE_PASSWORD, {
      body: data,
    });
  },

  /**
   * Refresh access token
   * RefreshToken được lấy tự động từ cookie
   * Chỉ dùng khi cần refresh thủ công, thông thường apiClient sẽ tự động refresh
   */
  refreshToken: async (): Promise<string> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      API_ENDPOINTS.REFRESH_TOKEN,
      {
        public: true, // Refresh endpoint không cần Bearer token
        skipAuthRetry: true, // Không retry khi 401 (tránh loop)
      }
    );

    // Lưu accessToken mới
    if (response.data?.accessToken) {
      authStore.setToken(response.data.accessToken);
    }

    return response.data.accessToken;
  },
};
