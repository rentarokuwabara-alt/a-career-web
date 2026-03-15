'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { MonthPicker } from '@/components/MonthPicker';
import { aggregateMonthly } from '@/lib/gas-client';
import { getCurrentMonth } from '@/lib/utils';
import { MonthlySummary } from '@/lib/types';

export default function Monthly() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSummaries = async () => {
      setIsLoading(true);
      try {
        const result = await aggregateMonthly(month);
        if (result.data) {
          setSummaries(result.data as MonthlySummary[]);
        }
      } catch (err) {
        console.error('Failed to load summaries:', err);
        setSummaries([
          { personId: 'M001', name: '太郎', section: '自社社員', month, allocDays: 21, actualDays: 20, restDays: 1, paidDays: 0, totalSell: 200000, totalCost: 30000, profit: 170000, profitRate: 85 },
          { personId: 'M002', name: '花子', section: '業務委託', month, allocDays: 0, actualDays: 18, restDays: 0, paidDays: 0, totalSell: 144000, totalCost: 144000, profit: 0, profitRate: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, [month]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>月次サマリー</h1>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { header: '人材ID', accessor: 'personId', format: 'text', width: 100 },
            { header: '氏名', accessor: 'name', format: 'text', width: 120 },
            { header: '区分', accessor: 'section', format: 'text', width: 120 },
            { header: '所定日数', accessor: 'allocDays', format: 'number', align: 'right', width: 90 },
            { header: '実績日数', accessor: 'actualDays', format: 'number', align: 'right', width: 90 },
            { header: '休み日数', accessor: 'restDays', format: 'number', align: 'right', width: 90 },
            { header: '売上', accessor: 'totalSell', format: 'currency', align: 'right' },
            { header: '原価', accessor: 'totalCost', format: 'currency', align: 'right' },
            { header: '粗利', accessor: 'profit', format: 'currency', align: 'right' },
            { header: '粗利率', accessor: 'profitRate', format: 'percent', align: 'right' },
          ]}
          data={summaries}
          isLoading={isLoading}
          emptyMessage="データがありません"
        />
      </div>
    </div>
  );
}
