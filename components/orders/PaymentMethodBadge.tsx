/**
 * PaymentMethodBadge Component
 * Badge hiển thị phương thức thanh toán
 */

'use client';

import type { PaymentMethod } from '@/types/order';

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  className?: string;
}

const methodConfig: Record<PaymentMethod, { label: string; className: string }> = {
  COD: {
    label: 'Thanh toán khi nhận hàng',
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  },
  MOMO: {
    label: 'Ví MoMo',
    className: 'bg-pink-100 text-pink-800 border-pink-300',
  },
  BANK: {
    label: 'Chuyển khoản ngân hàng',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
};

export default function PaymentMethodBadge({ method, className = '' }: PaymentMethodBadgeProps) {
  const config = methodConfig[method];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
