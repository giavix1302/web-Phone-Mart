# Hướng dẫn sử dụng Authentication

## Tổng quan

Dự án này sử dụng authentication với:
- **AccessToken**: Được lưu trong localStorage và gửi qua header `Authorization: Bearer {token}`
- **RefreshToken**: Được lưu trong cookie HttpOnly (browser tự động quản lý)
- **Auto Refresh**: Tự động refresh accessToken khi hết hạn (401)

## Cấu trúc thư mục

```
├── lib/
│   ├── api-client.ts      # API client với auto refresh token
│   └── auth-store.ts      # Store quản lý accessToken
├── services/
│   └── auth.service.ts    # Service gọi API auth
├── types/
│   └── auth.ts            # Types cho authentication
├── contexts/
│   └── auth-context.tsx   # React Context cho auth state
├── hooks/
│   └── use-auth.ts        # Hook để sử dụng auth trong components
└── constants/
    └── endpoints.ts       # Định nghĩa API endpoints
```

## Cách sử dụng

### 1. Setup môi trường

Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Sử dụng Auth Context

AuthProvider đã được wrap trong `app/layout.tsx`, bạn có thể sử dụng `useAuth` hook ở bất kỳ component nào:

```tsx
'use client';

import { useAuth } from '@/hooks/use-auth';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // ...
}
```

### 3. Gọi API Public (không cần auth)

```tsx
import { apiClient } from '@/lib/api-client';

// API public không cần Bearer token
const response = await apiClient.get('/public-endpoint', {
  public: true
});
```

### 4. Gọi API Protected (cần auth)

```tsx
import { apiClient } from '@/lib/api-client';

// API protected - tự động thêm Bearer token và tự động refresh nếu hết hạn
const response = await apiClient.get('/protected-endpoint');
// hoặc
const response = await apiClient.post('/protected-endpoint', {
  body: { data: 'value' }
});
```

### 5. Đăng nhập

```tsx
import { useAuth } from '@/hooks/use-auth';

const { login } = useAuth();

await login({
  email: 'user@example.com',
  password: 'password123'
});
// AccessToken được lưu tự động
// RefreshToken được set vào cookie tự động
```

### 6. Đăng ký

```tsx
import { useAuth } from '@/hooks/use-auth';

const { register, verifyRegisterOtp } = useAuth();

// Bước 1: Đăng ký (gửi OTP)
await register({
  email: 'user@example.com',
  fullName: 'Nguyễn Văn A'
});

// Bước 2: Verify OTP và tạo mật khẩu
await verifyRegisterOtp({
  email: 'user@example.com',
  otp: '123456',
  password: 'password123'
});
// AccessToken được lưu tự động sau khi verify thành công
```

### 7. Đăng xuất

```tsx
import { useAuth } from '@/hooks/use-auth';

const { logout } = useAuth();

await logout();
// AccessToken và RefreshToken được xóa tự động
```

## Tính năng tự động

### Auto Refresh Token

Khi gọi API protected và nhận 401 (Unauthorized), hệ thống sẽ:
1. Tự động gọi API `/api/auth/refresh` với refreshToken từ cookie
2. Lấy accessToken mới
3. Retry lại request ban đầu với token mới
4. Trả về kết quả như bình thường

**Lưu ý**: Refresh token được gửi tự động qua cookie, không cần code thêm.

### Bearer Token tự động

Khi gọi API protected (không có option `public: true`), Bearer token sẽ được tự động thêm vào header:
```
Authorization: Bearer {accessToken}
```

## Ví dụ Service

Tạo service mới cho API protected:

```tsx
// services/product.service.ts
import { apiClient } from '@/lib/api-client';

export const productService = {
  // API protected - tự động có Bearer token
  getAll: async () => {
    return apiClient.get('/products');
  },

  // API public - không cần token
  getPublicProducts: async () => {
    return apiClient.get('/products/public', {
      public: true
    });
  }
};
```

## Xử lý lỗi

```tsx
try {
  await apiClient.get('/protected-endpoint');
} catch (error) {
  if (error.statusCode === 401) {
    // Token hết hạn hoặc không hợp lệ
    // Hệ thống đã tự động thử refresh, nếu vẫn lỗi thì cần đăng nhập lại
    console.log('Cần đăng nhập lại');
  } else {
    // Lỗi khác
    console.error('Error:', error);
  }
}
```

## Lưu ý quan trọng

1. **Cookie**: RefreshToken được lưu trong cookie HttpOnly, browser tự động gửi kèm request. Đảm bảo `credentials: 'include'` được set (đã có sẵn trong api-client).

2. **CORS**: Backend cần cấu hình CORS để chấp nhận credentials:
   ```csharp
   // .NET example
   app.UseCors(options => {
     options.WithOrigins("http://localhost:3000")
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader();
   });
   ```

3. **Base URL**: Đảm bảo `NEXT_PUBLIC_API_URL` trong `.env.local` trỏ đúng đến backend.

4. **Token Storage**: AccessToken được lưu trong localStorage. RefreshToken được lưu trong cookie HttpOnly (không thể truy cập từ JavaScript).

5. **Auto Retry**: Hệ thống chỉ retry 1 lần khi gặp 401. Nếu refresh token cũng hết hạn, cần đăng nhập lại.
