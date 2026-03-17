'use client';

import { useEffect, useState, useMemo } from 'react';
import { DataTable } from '@/components/DataTable';
import { MonthPicker } from '@/components/MonthPicker';
import { readWorklog, createWorklog } from '@/lib/gas-client';
import { getCurrentMonth, formatCurrency } from '@/lib/utils';
import { Worklog, ProjectTypeKey, PROJECT_TYPES, getProjectTypeLabel } from '@/lib/types';
import { Plus, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface WorkLogPageProps {
  /** Filter by project type. undefined = show all */
  projectType?: ProjectTypeKey;
  /** Page title */
  title?: string;
}

export default function WorkLogPage({ projectType, title }: WorkLogPageProps) {
  const [month, setMonth] = useState(getCurrentMonth());
  const [allWorklogs, setAllWorklogs] = useState<Worklog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const pageTitle = title || (projectType ? `稼働管理 - ${PROJECT_TYPES[projectType].label}` : '稼働管理（全体）');

  useEffect(() => {
    const fetchWorklogs = async () => {
      setIsLoading(true);
      try {
        const result = await readWorklog(month);
        if (result.data) {
          setAllWorklogs(result.data as Worklog[]);
        }
      } catch (err) {
        console.error('Failed to load worklogs:', err);
        setAllWorklogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorklogs();
  }, [month]);

  // Filter by project type (client-side)
  const filteredWorklogs = useMemo(() => {
    if (!projectType) return allWorklogs;
    return allWorklogs.filter((w) => w.projectType === projectType);
  }, [allWorklogs, projectType]);

  // Summary calculations
  const summary = useMemo(() => {
    const totalSell = filteredWorklogs.reduce((s, w) => s + (w.sell || 0), 0);
    const totalCost = filteredWorklogs.reduce((s, w) => s + (w.cost || 0), 0);
    const totalProfit = filteredWorklogs.reduce((s, w) => s + (w.profit || 0), 0);
    const profitRate = totalSell > 0 ? Math.round((totalProfit / totalSell) * 1000) / 10 : 0;
    const count = filteredWorklogs.length;
    return { totalSell, totalCost, totalProfit, profitRate, count };
  }, [filteredWorklogs]);

  const columns = [
    { header: 'ID', accessor: 'id', format: 'text' as const, width: 80 },
    { header: '稼働日', accessor: 'date', format: 'date' as const, width: 110 },
    { header: '人材', accessor: 'personName', format: 'text' as const, width: 100 },
    { header: '案件', accessor: 'projectName', format: 'text' as const, width: 140 },
    { header: '勤務地', accessor: 'location', format: 'text' as const, width: 80 },
    { header: '稼働区分', accessor: 'status', format: 'text' as const, width: 80 },
    { header: '売上', accessor: 'sell', format: 'currency' as const, align: 'right' as const },
    { header: '原価', accessor: 'cost', format: 'currency' as const, align: 'right' as const },
    { header: '粗利', accessor: 'profit', format: 'currency' as const, align: 'right' as const },
    ...(!projectType
      ? [{ header: '種別', accessor: 'projectTypeLabel', format: 'text' as const, width: 130 }]
      : []),
  ];

  const displayData = filteredWorklogs.map((w) => ({
    ...w,
    personName: (w as any).personName || w.personId,
    projectName: (w as any).projectName || w.projectId,
    projectTypeLabel: w.projectType ? getProjectTypeLabel(w.projectType) : '-',
  }));

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {month} | {summary.count}件の稼働実績
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MonthPicker value={month} onChange={setMonth} />
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition"
          >
            <Plus size={16} />
            新規追加
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="売上合計" value={summary.totalSell} icon={<DollarSign size={18} className="text-blue-500" />} color="blue" />
        <SummaryCard label="原価合計" value={summary.totalCost} icon={<TrendingDown size={18} className="text-red-500" />} color="red" />
        <SummaryCard label="粗利合計" value={summary.totalProfit} icon={<TrendingUp size={18} className="text-green-500" />} color="green" />
        <SummaryCard label="粗利率" value={summary.profitRate} suffix="%" isCurrency={false} icon={<TrendingUp size={18} className="text-purple-500" />} color="purple" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable columns={columns} data={displayData} isLoading={isLoading} emptyMessage="稼働実績がありません" />
      </div>

      {showAddModal && (
        <AddWorklogModal projectType={projectType} month={month} onClose={() => setShowAddModal(false)} onCreated={() => { setShowAddModal(false); readWorklog(month).then((result) => { if (result.data) setAllWorklogs(result.data as Worklog[]); }); }} />
      )}
    </div>
  );
}

function SummaryCard({ label, value, suffix, isCurrency = true, icon, color }: { label: string; value: number; suffix?: string; isCurrency?: boolean; icon?: React.ReactNode; color?: string; }) {
  const displayValue = isCurrency ? `¥${value.toLocaleString('ja-JP')}` : `${value}${suffix || ''}`;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-1">{icon}<p className="text-xs text-gray-500">{label}</p></div>
      <p className="text-lg font-bold">{displayValue}</p>
    </div>
  );
}

function AddWorklogModal({ projectType, month, onClose, onCreated }: { projectType?: ProjectTypeKey; month: string; onClose: () => void; onCreated: () => void; }) {
  const [form, setForm] = useState({ date: '', personId: '', projectId: '', location: '', status: '通常', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.personId || !form.projectId) { setError('稼働日、人材ID、案件IDは必須です'); return; }
    setIsSubmitting(true); setError('');
    try {
      await createWorklog({ ...form, billFlg: 1, payFlg: 1, projectType: projectType || undefined });
      onCreated();
    } catch (err: any) { setError(err.message || '作成に失敗しました'); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 mx-4">
        <h2 className="text-lg font-bold mb-4">稼働実績を追加{projectType && <span className="text-sm font-normal text-blue-600 ml-2">({PROJECT_TYPES[projectType].label})</span>}</h2>
        {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-gray-600 mb-1">稼働日 *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-gray-600 mb-1">稼働区分</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded px-3 py-2 text-sm"><option value="通常">通常</option><option value="半休">半休</option><option value="休み">休み</option><option value="有給">有給</option></select></div>
            <div><label className="block text-xs text-gray-600 mb-1">人材ID *</label><input type="text" placeholder="例: M001" value={form.personId} onChange={(e) => setForm({ ...form, personId: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-gray-600 mb-1">案件ID *</label><input type="text" placeholder="例: P001" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-gray-600 mb-1">勤務地</label><input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
          </div>
          <div><label className="block text-xs text-gray-600 mb-1">備考</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50">キャンセル</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? '作成中...' : '追加'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
