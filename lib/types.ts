/**
 * types.ts
 * Global type definitions
 */

// ========================================
// Master Data Types
// ========================================

export interface Person {
  id: string;
  name: string;
  section: '自社社員' | '業務委託' | 'パートナー人材';
  company?: string;
  allocDays?: number;
  sellPrice: number;
  payPrice: number;
  paymentTerm?: string;
  taxClass?: string;
  notes?: string;
}

export interface Project {
  id: string;
  business: 'COMM' | 'RE_RENT' | 'RE_REFORM' | 'HR' | 'FIRST';
  name: string;
  client: string;
  clientId: string;
  sellOverride?: number;
  payOverride?: number;
  transport: number;
  status: 'planning' | '進行中' | 'pause' | 'complete';
  startDate: string;
  endDate?: string;
}

export interface Client {
  id: string;
  type: 'クライアント' | 'パートナー';
  name: string;
  dept?: string;
  paymentMethod?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

// ========================================
// Project Type (プロジェクト種別)
// ========================================

export const PROJECT_TYPES = {
  first_outsource: { key: 'first_outsource', label: 'First 委託', slug: 'first-outsource' },
  first_weekend: { key: 'first_weekend', label: 'First 週末', slug: 'first-weekend' },
  mobile_weekend: { key: 'mobile_weekend', label: '携帯販売 週末案件', slug: 'mobile-weekend' },
  mobile_outsource: { key: 'mobile_outsource', label: '携帯販売 委託案件', slug: 'mobile-outsource' },
  reform: { key: 'reform', label: 'リフォーム案件', slug: 'reform' },
  gas_sales: { key: 'gas_sales', label: 'ガス営業案件', slug: 'gas-sales' },
  other: { key: 'other', label: 'その他', slug: 'other' },
} as const;

export type ProjectTypeKey = keyof typeof PROJECT_TYPES;

export function getProjectTypeBySlug(slug: string): ProjectTypeKey | undefined {
  const entry = Object.entries(PROJECT_TYPES).find(([, v]) => v.slug === slug);
  return entry ? (entry[0] as ProjectTypeKey) : undefined;
}

export function getProjectTypeLabel(key: string): string {
  return (PROJECT_TYPES as any)[key]?.label ?? key;
}

// ========================================
// Transaction Types
// ========================================

export interface Worklog {
  id: string;
  date: string;
  personId: string;
  personName?: string;
  projectId: string;
  projectName?: string;
  location: string;
  sellPrice: number;
  payPrice: number;
  transport: number;
  status: '通常' | '半休' | '休み' | '有給';
  billFlg: 0 | 1;
  payFlg: 0 | 1;
  coef?: number;
  sell?: number;
  cost?: number;
  profit?: number;
  projectType?: string;
  notes?: string;
}

export interface Adjustment {
  id: string;
  month: string;
  personId: string;
  type: string;
  amount: number;
  reason?: string;
}

// ========================================
// Aggregate Types
// ========================================

export interface MonthlySummary {
  personId: string;
  name: string;
  section: string;
  month: string;
  allocDays: number;
  actualDays: number;
  restDays: number;
  paidDays: number;
  totalSell: number;
  totalCost: number;
  profit: number;
  profitRate: number;
}

export interface BillingItem {
  invoiceId: string;
  clientId: string;
  projectId: string;
  projectName: string;
  month: string;
  days: number;
  subtotal: number;
  transport: number;
  total: number;
}

export interface PaymentCheck {
  partnerId: string;
  partnerName: string;
  month: string;
  staffCount: number;
  days: number;
  actualAmount: number;
  invoicedAmount: number;
  difference: number;
  status: 'pending' | '確認済み' | 'discrepancy';
}

export interface DashboardKPI {
  month: string;
  summary: {
    totalSell: number;
    totalCost: number;
    totalProfit: number;
    profitRate: number;
  };
  byBusiness: {
    [business: string]: {
      sell: number;
      cost: number;
      profit: number;
      rate: number;
    };
  };
  byProject: {
    [projectId: string]: {
      name: string;
      sell: number;
      cost: number;
      profit: number;
      rate: number;
    };
  };
}

// ========================================
// API Response Types
// ========================================

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error';
  count: number;
  data: T[];
  error?: string;
}

// ========================================
// UI State Types
// ========================================

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete';
  data?: any;
}



// ========================================
// Billing Company Types (for billing page)
// ========================================

export interface BillingDetail {
  date: string;
  personName: string;
  projectName: string;
  location: string;
  sellPrice: number;
  transport: number;
  amount: number;
}

export interface BillingCompany {
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
