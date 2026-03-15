'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { readProjects } from '@/lib/gas-client';
import { Project } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function MasterProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const result = await readProjects();
        if (result.data) {
          setProjects(result.data as Project[]);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
        setProjects([
          { id: 'COMM-001', business: 'COMM', name: '東京通信工事', client: 'C社', clientId: 'CL001', sellOverride: 10000, transport: 1500, status: '進行中', startDate: '2026-01-01', endDate: '2026-06-30' },
          { id: 'COMM-002', business: 'COMM', name: '大阪回線保守', client: 'D社', clientId: 'CL002', sellOverride: 12000, transport: 2000, status: '進行中', startDate: '2026-02-01' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>案件マスター</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus size={20} />
          新規追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id', format: 'text', width: 100 },
            { header: '事業', accessor: 'business', format: 'text', width: 100 },
            { header: '案件名', accessor: 'name', format: 'text' },
            { header: 'クライアント', accessor: 'client', format: 'text', width: 120 },
            { header: '売上単価', accessor: 'sellOverride', format: 'currency', align: 'right' },
            { header: '状態', accessor: 'status', format: 'text', width: 100 },
          ]}
          data={projects}
          isLoading={isLoading}
          emptyMessage="案件データがありません"
        />
      </div>
    </div>
  );
}
