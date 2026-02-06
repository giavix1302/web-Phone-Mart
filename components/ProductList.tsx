/**
 * ProductList Component
 * Component hiển thị danh sách sản phẩm
 */

'use client';

import { useProducts } from '@/hooks/use-products';

export default function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.price.toLocaleString('vi-VN')} VNĐ</p>
          {product.description && (
            <p className="text-sm text-gray-500 mt-2">{product.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
