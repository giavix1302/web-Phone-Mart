/**
 * Card Component
 * Component card tái sử dụng với background trắng, border radius và shadow
 */

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );
}
