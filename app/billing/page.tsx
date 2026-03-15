'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { MonthPicker } from '@/components/MonthPicker';
import { generateBillingList } from '@/lib/gas-client';
import { getCurrentMonth } from '@/lib/utils';
import { BillingItem } from '@/lib/types';
import { FileText } from 'lucide-react';

export default function Billing() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [items, setItems] = useState<BillingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBillings = async () => {
      setIsLoading(true);
      try {
        const result = await generateBillingList(month);
        if (result.data) {
          setItems(result.data as BillingItem[]);
        }
      } catch (err) {
        console.error('Failed to load billings:', err);
        setItems([
          { invoiceId: 'INV0001', clientId: 'CL001', projectId: 'COMM-001', projectName: '東京通信工事', month, days: 20, subtotal: 200000, transport: 30000, total: 230000 },
          { invoiceId: 'INV0002', clientId: 'CL002', projectId: 'COMM-002', projectName: '大阪回線保守', month, days: 18, subtotal: 144000, transport: 27000, total: 171000 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillings();
  }, [month]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>請求管理</h1>
        <div className="flex items-center gap-4">
          <MonthPicker value={month} onChange={setMonth} />
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <FileText size={20} />
            freee連携
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { header: '請求ID', accessor: 'invoiceId', format: 'text', width: 100 },
            { header: '請求先ID', accessor: 'clientId', format: 'text', width: 100 },
            { header: '案件ID', accessor: 'projectId', format: 'text', width: 100 },
            { header: '案件名', accessor: 'projectName', format: 'text' },
            { header: '稼働日数', accessor: 'days', format: 'number', align: 'right', width: 90 },
            { header: '小計', accessor: 'subtotal', format: 'currency', align: 'right' },
            { header: '交通費', accessor: 'transport', format: 'currency', align: 'right' },
            { header: '請求額', accessor: 'total', format: 'currency', align: 'right' },
          ]}
          data={items}
          isLoading={isLoading}
          emptyMessage="請求データがありません"
        />
      </div>
    </div>
  );
}
