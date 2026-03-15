'use client';

import React from 'react';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';
import { Edit2, Trash2 } from 'lucide-react';

interface ColumnDef {
  header: string;
  accessor: string;
  format?: 'currency' | 'percent' | 'date' | 'number' | 'text';
  width?: number;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  columns: ColumnDef[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = 'No data',
}: DataTableProps) {
  const formatValue = (value: any, format?: string): string => {
    if (value === null || value === undefined) return '-';

    switch (format) {
      case 'currency':
        return formatCurrency(Number(value));
      case 'percent':
        return formatPercent(Number(value));
      case 'date':
        return formatDate(String(value));
      case 'number':
        return Number(value).toLocaleString('ja-JP');
      default:
        return String(value);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead>
          <tr className="bg-blue-600 text-white">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`px-4 py-3 font-semibold text-sm text-${col.align || 'left'}`}
                style={{ width: col.width ? `${col.width}px` : 'auto' }}
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 font-semibold text-sm text-center w-20">操作</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td
                  key={`${rowIndex}-${col.accessor}`}
                  className={`px-4 py-3 text-sm text-${col.align || 'left'}`}
                >
                  {formatValue(row[col.accessor], col.format)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-sm text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="編集"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id || row.ID)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
