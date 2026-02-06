/**
 * Auth Context
 * Context để quản lý authentication state trong ứng dụng
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authStore } from '@/lib/auth-store';
import { authService } from '@/services/auth.service';
import type { User, LoginRequest, RegisterRequest, VerifyRegisterOtpRequest } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyRegisterOtp: (data: VerifyRegisterOtpRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra authentication khi mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Có thể gọi API để lấy user info nếu cần
        // Hiện tại chỉ kiểm tra token có tồn tại không
        const token = authStore.getToken();
        if (token) {
          // TODO: Có thể gọi API để lấy user info
          // const userInfo = await userService.getMe();
          // setUser(userInfo);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authStore.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);
  };

  const verifyRegisterOtp = async (data: VerifyRegisterOtpRequest) => {
    await authService.verifyRegisterOtp(data);
    // Sau khi verify thành công, có thể gọi login hoặc lấy user info
    // Tạm thời chỉ lưu token, user sẽ được set khi login
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: authStore.isAuthenticated(),
    isLoading,
    login,
    register,
    verifyRegisterOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
