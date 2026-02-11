/**
 * OrderTrackingTimeline Component
 * Timeline hiển thị lịch sử tracking đơn hàng
 */

'use client';

import { CheckIcon } from '@heroicons/react/24/solid';
import OrderStatusBadge from './OrderStatusBadge';
import type { OrderTracking } from '@/types/order';

interface OrderTrackingTimelineProps {
  trackings: OrderTracking[];
}

export default function OrderTrackingTimeline({ trackings }: OrderTrackingTimelineProps) {
  if (!trackings || trackings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Chưa có thông tin tracking</p>
      </div>
    );
  }

  // Sort by createdAt descending (newest first)
  const sortedTrackings = [...trackings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedTrackings.map((tracking, index) => {
        const isLatest = index === 0;
        const formattedDate = new Date(tracking.createdAt).toLocaleString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={tracking.id} className="flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isLatest
                    ? 'bg-[#FF4F00] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <CheckIcon className="w-6 h-6" />
              </div>
              {index < sortedTrackings.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <OrderStatusBadge status={tracking.status} />
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>
              <p className="text-gray-700 font-medium mb-1">{tracking.description}</p>
              {tracking.location && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Địa điểm:</span> {tracking.location}
                </p>
              )}
              {tracking.trackingNumber && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Mã vận đơn:</span> {tracking.trackingNumber}
                </p>
              )}
              {tracking.note && (
                <p className="text-sm text-gray-500 italic mt-1">{tracking.note}</p>
              )}
              {tracking.estimatedDelivery && (
                <p className="text-sm text-[#FF4F00] font-semibold mt-2">
                  Dự kiến giao hàng: {new Date(tracking.estimatedDelivery).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
