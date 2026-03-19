'use client';

import { useEffect, useState } from 'react';
import { MonthPicker } from '@/components/MonthPicker';
import { generatePaymentCheck } from '@/lib/gas-client';
import { getCurrentMonth } from '@/lib/utils';
import { PaymentCheck } from '@/lib/types';
import { CheckCircle2, Circle, Clock, AlertTriangle, Building2 } from 'lucide-react';

type PaymentStatus = 'pending' | 'confirmed' | 'transferred' | 'discrepancy';

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; icon: any; bg: string }> = {
  pending: { label: 'æªç¢ºèª', color: 'text-gray-400', icon: Circle, bg: 'bg-gray-100' },
  confirmed: { label: 'ç¢ºèªæ¸ã¿', color: 'text-blue-600', icon: CheckCircle2, bg: 'bg-blue-50' },
  transferred: { label: 'æ¯è¾¼å®äº', color: 'text-green-600', icon: CheckCircle2, bg: 'bg-green-50' },
  discrepancy: { label: 'å·®ç°ãã', color: 'text-red-600', icon: AlertTriangle, bg: 'bg-red-50' },
};

export default function PaymentCheckPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [items, setItems] = useState<PaymentCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, PaymentStatus>>({});

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const result = await generatePaymentCheck(month);
        if (result.data) {
          setItems(result.data as PaymentCheck[]);
        }
      } catch (err) {
        console.error('Failed to load payment checks:', err);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [month]);

  const getStatus = (partnerId: string): PaymentStatus => {
    return statuses[partnerId] || 'pending';
  };

  const cycleStatus = (partnerId: string) => {
    const order: PaymentStatus[] = ['pending', 'confirmed', 'transferred', 'discrepancy'];
    const current = getStatus(partnerId);
    const next = order[(order.indexOf(current) + 1) % order.length];
    setStatuses((prev) => ({ ...prev, [partnerId]: next }));
  };

  const totalAmount = items.reduce((s, i) => s + i.actualAmount, 0);
  const transferredCount = Object.values(statuses).filter((s) => s === 'transferred').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold">æ¯æç¢ºèª</h1>
          <p className="text-sm text-gray-500 mt-1">
            {month} | {items.length}ç¤¾ã®æ¯æå
          </p>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">æ¯æåæ°</p>
          <p className="text-lg font-bold">{items.length}ç¤¾</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">æ¯æç·é¡</p>
          <p className="text-lg font-bold">Â¥{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">æ¯è¾¼å®äº</p>
          <p className="text-lg font-bold text-green-600">{transferredCount}ç¤¾</p>
        </div>
      </div>

      {/* Partner list */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">èª­ã¿è¾¼ã¿ä¸­...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">æ¯æãã¼ã¿ãããã¾ãã</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 border-b">
                <th className="text-left px-5 py-3 font-medium">æ¯æå</th>
                <th className="text-right px-4 py-3 font-medium">äººæ°</th>
                <th className="text-right px-4 py-3 font-medium">ç¨¼åæ¥æ°</th>
                <th className="text-right px-4 py-3 font-medium">æ¯æé¡ï¼è¨ç®ï¼</th>
                <th className="text-right px-4 py-3 font-medium">è«æ±é¡</th>
                <th className="text-right px-4 py-3 font-medium">å·®é¡</th>
                <th className="text-center px-4 py-3 font-medium">ã¹ãã¼ã¿ã¹</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const status = getStatus(item.partnerId);
                const statusConfig = STATUS_CONFIG[status];
                const StatusIcon = statusConfig.icon;
                const diff = item.invoicedAmount - item.actualAmount;

                return (
                  <tr key={item.partnerId} className="border-b hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-gray-400" />
                        <span className="font-medium">{item.partnerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">{item.staffCount}å</td>
                    <td className="px-4 py-4 text-right">{item.days}æ¥</td>
                    <td className="px-4 py-4 text-right font-medium">Â¥{item.actualAmount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right text-gray-500">Â¥{item.invoicedAmount.toLocaleString()}</td>
                    <td className={`px-4 py-4 text-right ${diff !== 0 ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                      {diff !== 0 ? `Â¥${diff.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => cycleStatus(item.partnerId)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${statusConfig.bg} ${statusConfig.color} hover:opacity-80`}
                      >
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

