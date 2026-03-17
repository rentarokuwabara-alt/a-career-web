'use client';

import { useEffect, useState, useMemo } from 'react';
import { DataTable } from '@/components/DataTable';
import { MonthPicker } from '@/components/MonthPicker';
import { aggregateMonthly, readWorklog } from '@/lib/gas-client';
import { getCurrentMonth } from '@/lib/utils';
import { MonthlySummary, Worklog, getProjectTypeLabel } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

export default function Monthly() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [worklogs, setWorklogs] = useState<Worklog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'person' | 'projectType'>('person');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [summaryResult, worklogResult] = await Promise.all([
          aggregateMonthly(month),
          readWorklog(month),
        ]);
        if (summaryResult.data) { setSummaries(summaryResult.data as MonthlySummary[]); }
        if (worklogResult.data) { setWorklogs(worklogResult.data as Worklog[]); }
      } catch (err) {
        console.error('Failed to load data:', err);
        setSummaries([]); setWorklogs([]);
      } finally { setIsLoading(false); }
    };
    fetchData();
  }, [month]);

  const projectTypeSummary = useMemo(() => {
    const map: Record<string, { sell: number; cost: number; profit: number; count: number }> = {};
    for (const w of worklogs) {
      const pt = w.projectType || 'other';
      if (!map[pt]) { map[pt] = { sell: 0, cost: 0, profit: 0, count: 0 }; }
      map[pt].sell += w.sell || 0;
      map[pt].cost += w.cost || 0;
      map[pt].profit += w.profit || 0;
      map[pt].count += 1;
    }
    return Object.entries(map).map(([key, val]) => ({
      projectType: key,
      projectTypeLabel: getProjectTypeLabel(key),
      days: val.count,
      totalSell: Math.round(val.sell),
      totalCost: Math.round(val.cost),
      profit: Math.round(val.profit),
      profitRate: val.sell > 0 ? Math.round((val.profit / val.sell) * 1000) / 10 : 0,
    }));
  }, [worklogs]);

  const totals = useMemo(() => {
    const totalSell = summaries.reduce((s, r) => s + (r.totalSell || 0), 0);
    const totalCost = summaries.reduce((s, r) => s + (r.totalCost || 0), 0);
    const totalProfit = summaries.reduce((s, r) => s + (r.profit || 0), 0);
    const profitRate = totalSell > 0 ? Math.round((totalProfit / totalSell) * 1000) / 10 : 0;
    return { totalSell, totalCost, totalProfit, profitRate };
  }, [summaries]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">月次サマリー</h1>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="売上合計" value={totals.totalSell} icon={<DollarSign size={18} className="text-blue-500" />} />
        <KPICard label="原価合計" value={totals.totalCost} icon={<TrendingDown size={18} className="text-red-500" />} />
        <KPICard label="粗利合計" value={totals.totalProfit} icon={<TrendingUp size={18} className="text-green-500" />} />
        <KPICard label="粗利率" value={totals.profitRate} suffix="%" isCurrency={false} icon={<BarChart3 size={18} className="text-purple-500" />} />
      </div>

      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('person')} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'person' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>人材別サマリー</button>
        <button onClick={() => setActiveTab('projectType')} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'projectType' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>プロジェクト種別サマリー</button>
      </div>

      {activeTab === 'person' && (
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
            data={summaries} isLoading={isLoading} emptyMessage="データがありません"
          />
        </div>
      )}

      {activeTab === 'projectType' && (
        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            columns={[
              { header: 'プロジェクト種別', accessor: 'projectTypeLabel', format: 'text', width: 160 },
              { header: '稼働日数', accessor: 'days', format: 'number', align: 'right', width: 100 },
              { header: '売上', accessor: 'totalSell', format: 'currency', align: 'right' },
              { header: '原価', accessor: 'totalCost', format: 'currency', align: 'right' },
              { header: '粗利', accessor: 'profit', format: 'currency', align: 'right' },
              { header: '粗利率', accessor: 'profitRate', format: 'percent', align: 'right' },
            ]}
            data={projectTypeSummary} isLoading={isLoading} emptyMessage="データがありません"
          />
          {projectTypeSummary.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">売上構成比</h3>
              {(() => {
                const maxSell = Math.max(...projectTypeSummary.map((p) => p.totalSell), 1);
                return projectTypeSummary.sort((a, b) => b.totalSell - a.totalSell).map((item) => (
                  <div key={item.projectType} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-32 shrink-0">{item.projectTypeLabel}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${(item.totalSell / maxSell) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-700 w-24 text-right">¥{item.totalSell.toLocaleString('ja-JP')}</span>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function KPICard({ label, value, suffix, isCurrency = true, icon }: { label: string; value: number; suffix?: string; isCurrency?: boolean; icon?: React.ReactNode; }) {
  const displayValue = isCurrency ? `¥${value.toLocaleString('ja-JP')}` : `${value}${suffix || ''}`;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-1">{icon}<p className="text-xs text-gray-500">{label}</p></div>
      <p className="text-lg font-bold">{displayValue}</p>
    </div>
  );
}
