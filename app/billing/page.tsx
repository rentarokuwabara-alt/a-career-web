'use client';

import { useEffect, useState } from 'react';
import { MonthPicker } from '@/components/MonthPicker';
import { generateBillingList } from '@/lib/gas-client';
import { getCurrentMonth, formatCurrency } from '@/lib/utils';
import { FileText, ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, Building2 } from 'lucide-react';

interface BillingDetail {
  date: string;
  personName: string;
  projectName: string;
  location: string;
  sellPrice: number;
  transport: number;
  amount: number;
}

interface BillingCompany {
  invoiceId: string;
  clientId: string;
  clientName: string;
  month: string;
  staffCount: number;
  days: number;
  subtotal: number;
  transport: number;
  total: number;
  status: string;
  details: BillingDetail[];
}

type BillingStatus = 'pending' | 'ready' | 'invoiced' | 'paid';

const STATUS_CONFIG: Record<BillingStatus, { label: string; color: string; icon: any; bg: string }> = {
  pending: { label: 'æªæºå', color: 'text-gray-400', icon: Circle, bg: 'bg-gray-100' },
  ready: { label: 'è«æ±æºåå®äº', color: 'text-yellow-600', icon: Clock, bg: 'bg-yellow-50' },
  invoiced: { label: 'è«æ±æ¸ã¿', color: 'text-blue-600', icon: CheckCircle2, bg: 'bg-blue-50' },
  paid: { label: 'å¥éç¢ºèªæ¸ã¿', color: 'text-green-600', icon: CheckCircle2, bg: 'bg-green-50' },
};

export default function Billing() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [companies, setCompanies] = useState<BillingCompany[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Record<string, BillingStatus>>({});

  useEffect(() => {
    const fetchBillings = async () => {
      setIsLoading(true);
      try {
        const result = await generateBillingList(month);
        if (result.data) {
          setCompanies(result.data as any);
        }
      } catch (err) {
        console.error('Failed to load billings:', err);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBillings();
  }, [month]);

  const toggleExpand = (clientName: string) => {
    setExpandedCompanies((prev) => {
      const next = new Set(prev);
      if (next.has(clientName)) {
        next.delete(clientName);
      } else {
        next.add(clientName);
      }
      return next;
    });
  };

  const getStatus = (clientName: string): BillingStatus => {
    return statuses[clientName] || 'pending';
  };

  const cycleStatus = (clientName: string) => {
    const order: BillingStatus[] = ['pending', 'ready', 'invoiced', 'paid'];
    const current = getStatus(clientName);
    const currentIdx = order.indexOf(current);
    const next = order[(currentIdx + 1) % order.length];
    setStatuses((prev) => ({ ...prev, [clientName]: next }));
  };

  // Summary totals
  const totalAmount = companies.reduce((s, c) => s + c.total, 0);
  const paidCount = Object.values(statuses).filter((s) => s === 'paid').length;
  const invoicedCount = Object.values(statuses).filter((s) => s === 'invoiced').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold">è«æ±ç®¡ç</h1>
          <p className="text-sm text-gray-500 mt-1">
            {month} | {companies.length}ç¤¾ã®è«æ±å
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MonthPicker value={month} onChange={setMonth} />
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm transition">
            <FileText size={16} />
            freeeé£æº
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">è«æ±åæ°</p>
          <p className="text-lg font-bold">{companies.length}ç¤¾</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">è«æ±ç·é¡</p>
          <p className="text-lg font-bold">Â¥{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">è«æ±æ¸ã¿</p>
          <p className="text-lg font-bold text-blue-600">{invoicedCount}ç¤¾</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500">å¥éç¢ºèªæ¸ã¿</p>
          <p className="text-lg font-bold text-green-600">{paidCount}ç¤¾</p>
        </div>
      </div>

      {/* Company list */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">èª­ã¿è¾¼ã¿ä¸­...</div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">è«æ±ãã¼ã¿ãããã¾ãã</div>
      ) : (
        <div className="space-y-3">
          {companies.map((company) => {
            const isExpanded = expandedCompanies.has(company.clientName);
            const status = getStatus(company.clientName);
            const statusConfig = STATUS_CONFIG[status];
            const StatusIcon = statusConfig.icon;

            return (
              <div key={company.invoiceId} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Company header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleExpand(company.clientName)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                    <Building2 size={18} className="text-blue-500" />
                    <div>
                      <span className="font-bold text-sm">{company.clientName}</span>
                      <span className="ml-3 text-xs text-gray-400">{company.staffCount}å / {company.days}æ¥ç¨¼å</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">Â¥{company.total.toLocaleString()}</span>

                    {/* Status button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); cycleStatus(company.clientName); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${statusConfig.bg} ${statusConfig.color} hover:opacity-80`}
                    >
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400 border-b">
                          <th className="text-left py-2 font-normal">æ¥ä»</th>
                          <th className="text-left py-2 font-normal">äººæ</th>
                          <th className="text-left py-2 font-normal">æ¡ä»¶</th>
                          <th className="text-left py-2 font-normal">å¤åå°</th>
                          <th className="text-right py-2 font-normal">åä¾¡</th>
                          <th className="text-right py-2 font-normal">äº¤éè²»</th>
                          <th className="text-right py-2 font-normal">éé¡</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.details.map((d, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2 text-gray-600">{d.date}</td>
                            <td className="py-2">{d.personName}</td>
                            <td className="py-2">{d.projectName}</td>
                            <td className="py-2 text-gray-500">{d.location}</td>
                            <td className="py-2 text-right">Â¥{d.sellPrice.toLocaleString()}</td>
                            <td className="py-2 text-right text-gray-500">Â¥{d.transport.toLocaleString()}</td>
                            <td className="py-2 text-right font-medium">Â¥{d.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold">
                          <td colSpan={4} className="py-2">åè¨</td>
                          <td className="py-2 text-right">Â¥{company.subtotal.toLocaleString()}</td>
                          <td className="py-2 text-right">Â¥{company.transport.toLocaleString()}</td>
                          <td className="py-2 text-right">Â¥{company.total.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

