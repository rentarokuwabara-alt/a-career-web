'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { DataTable } from '@/components/DataTable';
import { MonthPicker } from '@/components/MonthPicker';
import { getCurrentMonth } from '@/lib/utils';
import { getDashboardKPI } from '@/lib/gas-client';
import { DashboardKPI } from '@/lib/types';

export default function Dashboard() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [kpi, setKPI] = useState<DashboardKPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKPI = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await getDashboardKPI(month);
        if (result.data) {
          setKPI(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
        // Demo data fallback
        setKPI({
          month,
          summary: {
            totalSell: 1500000,
            totalCost: 950000,
            totalProfit: 550000,
            profitRate: 36.7,
          },
          byBusiness: {
            COMM: { sell: 1200000, cost: 760000, profit: 440000, rate: 36.7 },
            RE_RENT: { sell: 300000, cost: 190000, profit: 110000, rate: 36.7 },
          },
          byProject: {
            'COMM-001': { name: '東京通信工事', sell: 500000, cost: 315000, profit: 185000, rate: 37 },
            'COMM-002': { name: '大阪回線保守', sell: 450000, cost: 285000, profit: 165000, rate: 36.7 },
            'RE-RENT-001': { name: '港区物件A', sell: 300000, cost: 190000, profit: 110000, rate: 36.7 },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPI();
  }, [month]);

  const projectData = kpi?.byProject
    ? Object.entries(kpi.byProject).map(([id, data]) => ({
        id,
        name: data.name,
        sell: data.sell,
        cost: data.cost,
        profit: data.profit,
        rate: data.rate,
      }))
    : [];

  const businessData = kpi?.byBusiness
    ? Object.entries(kpi.byBusiness).map(([business, data]) => ({
        business,
        sell: data.sell,
        cost: data.cost,
        profit: data.profit,
        rate: data.rate,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>ダッシュボード</h1>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
          <p className="text-sm">
            ⚠️ {error} (デモデータを表示しています)
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="売上"
          value={kpi?.summary.totalSell || 0}
          format="currency"
        />
        <Card
          title="原価"
          value={kpi?.summary.totalCost || 0}
          format="currency"
        />
        <Card
          title="粗利"
          value={kpi?.summary.totalProfit || 0}
          format="currency"
        />
        <Card
          title="粗利率"
          value={kpi?.summary.profitRate || 0}
          format="percent"
        />
      </div>

      {/* Business Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">事業別サマリー</h2>
        <DataTable
          columns={[
            { header: '事業', accessor: 'business', format: 'text' },
            { header: '売上', accessor: 'sell', format: 'currency', align: 'right' },
            { header: '原価', accessor: 'cost', format: 'currency', align: 'right' },
            { header: '粗利', accessor: 'profit', format: 'currency', align: 'right' },
            { header: '粗利率', accessor: 'rate', format: 'percent', align: 'right' },
          ]}
          data={businessData}
          isLoading={isLoading}
          emptyMessage="データがありません"
        />
      </div>

      {/* Project Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">案件別サマリー</h2>
        <DataTable
          columns={[
            { header: '案件ID', accessor: 'id', format: 'text', width: 120 },
            { header: '案件名', accessor: 'name', format: 'text' },
            { header: '売上', accessor: 'sell', format: 'currency', align: 'right' },
            { header: '原価', accessor: 'cost', format: 'currency', align: 'right' },
            { header: '粗利', accessor: 'profit', format: 'currency', align: 'right' },
            { header: '粗利率', accessor: 'rate', format: 'percent', align: 'right' },
          ]}
          data={projectData}
          isLoading={isLoading}
          emptyMessage="データがありません"
        />
      </div>
    </div>
  );
}
