'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Plus } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export default function MasterCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement GAS API call for M_会社
        setCompanies([
          { id: 'CP001', name: 'A-Career', type: '自社', phone: '03-XXXX-XXXX' },
          { id: 'CP002', name: 'B社', type: 'パートナー', phone: '03-YYYY-YYYY' },
          { id: 'CP003', name: 'C社', type: 'クライアント', phone: '03-ZZZZ-ZZZZ' },
        ]);
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>会社マスター</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus size={20} />
          新規追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id', format: 'text', width: 100 },
            { header: '会社名', accessor: 'name', format: 'text', width: 200 },
            { header: '区分', accessor: 'type', format: 'text', width: 120 },
            { header: '電話', accessor: 'phone', format: 'text', width: 150 },
            { header: 'メール', accessor: 'email', format: 'text', width: 200 },
            { header: '備考', accessor: 'notes', format: 'text' },
          ]}
          data={companies}
          isLoading={isLoading}
          emptyMessage="会社データがありません"
        />
      </div>
    </div>
  );
}
