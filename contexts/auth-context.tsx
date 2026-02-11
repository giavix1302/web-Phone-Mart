/**
 * Auth Context
 * Context để quản lý authentication state trong ứng dụng
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authStore } from '@/lib/auth-store';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
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
        const token = authStore.getToken();
        if (token) {
          // Try to get user profile to populate user info
          try {
            const profile = await userService.getMyProfile();
            // Map profile to User type (profile doesn't have roles, so we'll use empty array)
            // In a real app, you might have a separate endpoint for user info with roles
            setUser({
              id: profile.id,
              email: profile.email,
              fullName: profile.fullName || '',
              roles: [], // Roles not available in profile, would need separate endpoint
            });
          } catch (profileError) {
            // If profile fetch fails, user might not be fully authenticated
            // Keep token but don't set user
            console.warn('Failed to fetch user profile:', profileError);
          }
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
    // Try to fetch profile to get additional info (address, etc.)
    try {
      const profile = await userService.getMyProfile();
      // Update user with profile data if needed
      // Note: response.user already has the basic info, profile has address, note, avatarUrl
    } catch (error) {
      // Profile fetch is optional, don't fail login if it fails
      console.warn('Failed to fetch profile after login:', error);
    }
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);
  };

  const verifyRegisterOtp = async (data: VerifyRegisterOtpRequest) => {
    const accessToken = await authService.verifyRegisterOtp(data);
    // Sau khi verify thành công, token đã được lưu
    // Có thể gọi API để lấy user info nếu cần
    // Tạm thời chỉ lưu token, user sẽ được set khi login hoặc khi có API get user info
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
