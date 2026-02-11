/**
 * OrderStatusBadge Component
 * Badge hiển thị trạng thái đơn hàng với màu sắc
 */

'use client';

import type { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Chờ xử lý',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  PROCESSING: {
    label: 'Đang xử lý',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  SHIPPED: {
    label: 'Đang giao hàng',
    className: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  DELIVERED: {
    label: 'Đã giao hàng',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
