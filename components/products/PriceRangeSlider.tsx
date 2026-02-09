/**
 * PriceRangeSlider Component
 * Range slider 2 đầu để filter giá sản phẩm
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  minValue?: number;
  maxValue?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
}

export default function PriceRangeSlider({
  min,
  max,
  minValue,
  maxValue,
  onChange,
}: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(minValue ?? min);
  const [localMax, setLocalMax] = useState(maxValue ?? max);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef({ localMin, localMax, minValue, maxValue });

  // Update ref khi values thay đổi
  useEffect(() => {
    valuesRef.current = { localMin, localMax, minValue, maxValue };
  }, [localMin, localMax, minValue, maxValue]);

  useEffect(() => {
    setLocalMin(minValue ?? min);
    setLocalMax(maxValue ?? max);
  }, [minValue, maxValue, min, max]);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (type: 'min' | 'max') => {
    setIsDragging(type);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const value = Math.round(min + (percentage / 100) * (max - min));
      const { localMin: currentMin, localMax: currentMax } = valuesRef.current;

      if (isDragging === 'min') {
        const newMin = Math.min(value, currentMax - 1000);
        setLocalMin(newMin);
        // Luôn gửi cả min và max, chỉ set undefined nếu bằng giá trị mặc định
        onChange(newMin === min ? undefined : newMin, maxValue ?? currentMax);
      } else {
        const newMax = Math.max(value, currentMin + 1000);
        setLocalMax(newMax);
        // Luôn gửi cả min và max, chỉ set undefined nếu bằng giá trị mặc định
        onChange(minValue ?? currentMin, newMax === max ? undefined : newMax);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, minValue, maxValue, onChange]);

  const minPercentage = getPercentage(localMin);
  const maxPercentage = getPercentage(localMax);

  return (
    <div className="space-y-4">
      {/* Value Display */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Từ:</span>
          <span className="font-semibold text-[#FF4F00]">
            {localMin.toLocaleString('vi-VN')} ₫
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Đến:</span>
          <span className="font-semibold text-[#FF4F00]">
            {localMax.toLocaleString('vi-VN')} ₫
          </span>
        </div>
      </div>

      {/* Slider */}
      <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full">
        {/* Active Range */}
        <div
          className="absolute h-2 bg-[#FF4F00] rounded-full"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />

        {/* Min Thumb */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-[#FF4F00] rounded-full cursor-grab active:cursor-grabbing shadow-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform"
          style={{ left: `${minPercentage}%` }}
          onMouseDown={() => handleMouseDown('min')}
        />

        {/* Max Thumb */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-[#FF4F00] rounded-full cursor-grab active:cursor-grabbing shadow-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform"
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={() => handleMouseDown('max')}
        />
      </div>
    </div>
  );
}
