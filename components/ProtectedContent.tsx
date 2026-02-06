/**
 * ProtectedContent Component
 * Component ví dụ cho nội dung cần authentication
 */

'use client';

import { useAuth } from '@/hooks/use-auth';

export default function ProtectedContent() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập để xem nội dung này.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Nội dung được bảo vệ</h2>
      
      {user && (
        <div className="mb-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Họ tên:</strong> {user.fullName}</p>
          <p><strong>Vai trò:</strong> {user.roles.join(', ')}</p>
        </div>
      )}

      <button
        onClick={logout}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}
