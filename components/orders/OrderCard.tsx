/**
 * OrderCard Component
 * Card hiển thị order summary trong danh sách
 */

'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import OrderStatusBadge from './OrderStatusBadge';
import type { OrderSummary } from '@/types/order';

interface OrderCardProps {
  order: OrderSummary;
}

export default function OrderCard({ order }: OrderCardProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Order Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-[#333333]">#{order.orderNumber}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-semibold">Ngày đặt:</span> {formattedDate}
              </p>
              <p>
                <span className="font-semibold">Số sản phẩm:</span> {order.itemCount}
              </p>
            </div>
          </div>

          {/* Right: Amount & Arrow */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
              <p className="text-2xl font-bold text-[#FF4F00]">
                {order.totalAmount.toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  );
}
