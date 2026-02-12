/**
 * ReviewButton Component
 * Button component để mở modal tạo review với orderItemId
 */

'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useProduct } from '@/hooks/use-product';
import CreateReviewForm from './CreateReviewForm';

interface ReviewButtonProps {
  productId: number;
  orderItemId: number;
  productName: string;
  onSuccess: () => void;
}

export default function ReviewButton({
  productId,
  orderItemId,
  productName,
  onSuccess,
}: ReviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { product, loading: productLoading } = useProduct(productId);

  const handleSuccess = () => {
    onSuccess();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm bg-[#FF4F00] text-white rounded-lg hover:bg-[#e64500] transition-colors font-medium"
      >
        Đánh giá
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#333333]">Đánh giá sản phẩm</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Đóng"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {productLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4F00]"></div>
                </div>
              ) : product ? (
                <>
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Sản phẩm</p>
                    <p className="font-semibold text-[#333333]">{productName}</p>
                  </div>
                  <CreateReviewForm
                    product={product}
                    orderItemId={orderItemId}
                    onSuccess={handleSuccess}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không thể tải thông tin sản phẩm</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
