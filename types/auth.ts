/**
 * Auth Types
 * Định nghĩa các types cho authentication
 */

export interface User {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  address: string | null;
  note: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  address?: string;
  note?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: null; // User thường không nhận refreshToken trong JSON
  user: User;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
}

export interface VerifyRegisterOtpRequest {
  email: string;
  otp: string;
  password: string;
}

export interface VerifyRegisterOtpResponse {
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface AuthError {
  success: false;
  message: string;
  statusCode?: number;
  data?: Array<{
    field: string;
    message: string;
  }>;
}
