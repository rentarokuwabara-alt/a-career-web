'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { readPeople } from '@/lib/gas-client';
import { Person } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function MasterPeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      setIsLoading(true);
      try {
        const result = await readPeople();
        if (result.data) {
          setPeople(result.data as Person[]);
        }
      } catch (err) {
        console.error('Failed to load people:', err);
        setPeople([
          { id: 'M001', name: '太郎', section: '自社社員', company: 'A-Career', allocDays: 21, sellPrice: 10000, payPrice: 0 },
          { id: 'M002', name: '花子', section: '業務委託', allocDays: 0, sellPrice: 8000, payPrice: 8000 },
          { id: 'M003', name: '次郎', section: 'パートナー人材', company: 'B社', sellPrice: 12000, payPrice: 10000 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>人材マスター</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus size={20} />
          新規追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id', format: 'text', width: 80 },
            { header: '氏名', accessor: 'name', format: 'text', width: 120 },
            { header: '区分', accessor: 'section', format: 'text', width: 140 },
            { header: '所属会社', accessor: 'company', format: 'text', width: 150 },
            { header: '標準売上単価', accessor: 'sellPrice', format: 'currency', align: 'right' },
            { header: '標準支払単価', accessor: 'payPrice', format: 'currency', align: 'right' },
          ]}
          data={people}
          isLoading={isLoading}
          emptyMessage="人材データがありません"
        />
      </div>
    </div>
  );
}
