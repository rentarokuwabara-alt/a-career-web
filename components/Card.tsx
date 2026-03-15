'use client';

import { formatCurrency, formatPercent } from '@/lib/utils';

interface CardProps {
  title: string;
  value: number | string;
  format?: 'currency' | 'percent' | 'number' | 'text';
  trend?: { value: number; direction: 'up' | 'down' };
  className?: string;
}

export function Card({ title, value, format = 'text', trend, className = '' }: CardProps) {
  let formattedValue: string;

  switch (format) {
    case 'currency':
      formattedValue = formatCurrency(Number(value));
      break;
    case 'percent':
      formattedValue = formatPercent(Number(value));
      break;
    case 'number':
      formattedValue = Number(value).toLocaleString('ja-JP');
      break;
    default:
      formattedValue = String(value);
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{formattedValue}</p>
        {trend && (
          <span className={`text-sm font-semibold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}
