'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { readClients } from '@/lib/gas-client';
import { Client } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function MasterClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const result = await readClients();
        if (result.data) {
          setClients(result.data as Client[]);
        }
      } catch (err) {
        console.error('Failed to load clients:', err);
        setClients([
          { id: 'CL001', type: 'クライアント', name: 'C社東京支店', email: 'billing@c-corp.jp' },
          { id: 'CL002', type: 'クライアント', name: 'D社', email: 'billing@d-corp.jp' },
          { id: 'BP001', type: 'パートナー', name: 'B社' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>取引先マスター</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus size={20} />
          新規追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id', format: 'text', width: 100 },
            { header: '区分', accessor: 'type', format: 'text', width: 120 },
            { header: '名称', accessor: 'name', format: 'text' },
            { header: 'メール', accessor: 'email', format: 'text', width: 200 },
          ]}
          data={clients}
          isLoading={isLoading}
          emptyMessage="取引先データがありません"
        />
      </div>
    </div>
  );
}
