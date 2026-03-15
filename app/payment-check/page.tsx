'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { MonthPicker } from '@/components/MonthPicker';
import { generatePaymentCheck } from '@/lib/gas-client';
import { getCurrentMonth } from '@/lib/utils';
import type { PaymentCheck } from '@/lib/types';

export default function PaymentCheck() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [checks, setChecks] = useState<PaymentCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const result = await generatePaymentCheck(month);
        if (result.data) {
          setChecks(result.data as PaymentCheck[]);
        }
      } catch (err) {
        console.error('Failed to load payments:', err);
        setChecks([
          { partnerId: 'BP001', partnerName: 'B社', month, staffCount: 1, days: 20, actualAmount: 200000, invoicedAmount: 200000, difference: 0, status: '確認済み' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [month]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>支払確認</h1>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { header: 'パートナーID', accessor: 'partnerId', format: 'text', width: 120 },
            { header: 'パートナー名', accessor: 'partnerName', format: 'text', width: 150 },
            { header: '人員', accessor: 'staffCount', format: 'number', align: 'right', width: 70 },
            { header: '稼働日数', accessor: 'days', format: 'number', align: 'right', width: 90 },
            { header: '稼働実績額', accessor: 'actualAmount', format: 'currency', align: 'right' },
            { header: '相手先請求額', accessor: 'invoicedAmount', format: 'currency', align: 'right' },
            { header: '差異', accessor: 'difference', format: 'currency', align: 'right' },
            { header: 'ステータス', accessor: 'status', format: 'text', width: 100 },
          ]}
          data={checks}
          isLoading={isLoading}
          emptyMessage="支払データがありません"
        />
      </div>
    </div>
  );
}
