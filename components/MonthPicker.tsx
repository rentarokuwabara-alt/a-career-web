'use client';

import { getCurrentMonth, addMonths } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthPickerProps {
  value: string;
  onChange: (month: string) => void;
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(addMonths(value, -1))}
        className="p-2 rounded hover:bg-gray-200"
      >
        <ChevronLeft size={20} />
      </button>

      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded"
      />

      <button
        onClick={() => onChange(addMonths(value, 1))}
        className="p-2 rounded hover:bg-gray-200"
      >
        <ChevronRight size={20} />
      </button>

      <button
        onClick={() => onChange(getCurrentMonth())}
        className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        今月
      </button>
    </div>
  );
}
