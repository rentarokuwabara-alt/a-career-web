'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { AddPersonForm } from '@/components/AddPersonForm';
import { readPeople } from '@/lib/gas-client';
import { Person } from '@/lib/types';
import { Plus } from 'lucide-react';

// Demo data from Google Sheets (all 7 records)
const DEMO_PEOPLE: Person[] = [
  { id: 'M001', name: '太郎', section: '自社社員', company: 'A-Career', allocDays: 21, sellPrice: 10000, payPrice: 0 },
  { id: 'M002', name: '花子', section: '業務委託', allocDays: 0, sellPrice: 8000, payPrice: 8000 },
  { id: 'M003', name: '次郎', section: 'パートナー人材', company: 'B社', allocDays: 0, sellPrice: 12000, payPrice: 10000 },
  { id: 'M004', name: '美咲', section: '自社社員', company: 'A-Career', allocDays: 21, sellPrice: 9000, payPrice: 0 },
  { id: 'M005', name: '健太', section: '業務委託', allocDays: 0, sellPrice: 9500, payPrice: 9500 },
  { id: 'M006', name: '相坂裕太', section: '自社社員', company: 'A-Career', allocDays: 21, sellPrice: 400000, payPrice: 280000 },
  { id: 'M007', name: '大澤秀司', section: '自社社員', company: 'A-Career', allocDays: 21, sellPrice: 400000, payPrice: 310000 },
];

export default function MasterPeople() {
  const [people, setPeople] = useState<Person[]>(DEMO_PEOPLE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      setIsLoading(true);
      setError(null);

      // Retry logic with exponential backoff
      const maxRetries = 2;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = await readPeople();
          if (result.data) {
            setPeople(result.data as Person[]);
            setError(null);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error(`Attempt ${attempt + 1} failed:`, err);

          // Only set error after all retries exhausted
          if (attempt === maxRetries) {
            setError('API接続に失敗しました。デモデータを表示します。');
            // Keep demo data as fallback
          } else {
            // Wait before retry with exponential backoff
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
          }
        }
      }

      setIsLoading(false);
    };

    fetchPeople();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    // Refresh data from API
    const fetchPeople = async () => {
      try {
        const result = await readPeople();
        if (result.data) {
          setPeople(result.data as Person[]);
        }
      } catch (err) {
        console.error('Failed to refresh people:', err);
      }
    };
    fetchPeople();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>人材マスター</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          <Plus size={20} />
          新規追加
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          ⚠️ {error}
        </div>
      )}

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

      {showForm && (
        <AddPersonForm
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
