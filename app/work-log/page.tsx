'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { MonthPicker } from '@/components/MonthPicker';
import { readWorklog } from '@/lib/gas-client';
import { getCurrentMonth } from '@/lib/utils';
import { Worklog } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function WorkLog() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [worklogs, setWorklogs] = useState<Worklog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorklogs = async () => {
      setIsLoading(true);
      try {
        const result = await readWorklog(month);
        if (result.data) {
          setWorklogs(result.data as Worklog[]);
        }
      } catch (err) {
        console.error('Failed to load worklogs:', err);
        setWorklogs([
          { id: 'WL0001', date: '2026-03-01', personId: 'M001', projectId: 'COMM-001', location: '東京', sellPrice: 10000, payPrice: 0, transport: 1500, status: '通常', billFlg: 1, payFlg: 1 },
          { id: 'WL0002', date: '2026-03-02', personId: 'M002', projectId: 'COMM-002', location: '大阪', sellPrice: 8000, payPrice: 8000, transport: 2000, status: '通常', billFlg: 1, payFlg: 1 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorklogs();
  }, [month]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>稼働管理</h1>
        <div className="flex items-center gap-4">
          <MonthPicker value={month} onChange={setMonth} />
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus size={20} />
            新規追加
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id', format: 'text', width: 100 },
            { header: '稼働日', accessor: 'date', format: 'date', width: 110 },
            { header: '人材ID', accessor: 'personId', format: 'text', width: 90 },
            { header: '案件ID', accessor: 'projectId', format: 'text', width: 100 },
            { header: '勤務地', accessor: 'location', format: 'text' },
            { header: '稼働区分', accessor: 'status', format: 'text', width: 90 },
            { header: '売上', accessor: 'sell', format: 'currency', align: 'right' },
            { header: '原価', accessor: 'cost', format: 'currency', align: 'right' },
            { header: '粗利', accessor: 'profit', format: 'currency', align: 'right' },
          ]}
          data={worklogs}
          isLoading={isLoading}
          emptyMessage="稼働実績がありません"
        />
      </div>
    </div>
  );
}
