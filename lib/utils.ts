/**
 * utils.ts
 * Utility functions
 */

/**
 * Format number as currency (JPY)
 */
export function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return '-';
  return `¥${value.toLocaleString('ja-JP')}`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number | undefined): string {
  if (value === undefined || value === null) return '-';
  return `${value.toFixed(1)}%`;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: string | Date | undefined): string {
  if (!date) return '-';

  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Get current month (YYYY-MM)
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Add months
 */
export function addMonths(month: string, delta: number): string {
  const [year, m] = month.split('-').map(Number);
  let newMonth = m + delta;
  let newYear = year;

  while (newMonth > 12) {
    newMonth -= 12;
    newYear++;
  }

  while (newMonth < 1) {
    newMonth += 12;
    newYear--;
  }

  return `${newYear}-${String(newMonth).padStart(2, '0')}`;
}

/**
 * Parse YYYY-MM
 */
export function parseMonth(month: string): { year: number; month: number } {
  const [year, m] = month.split('-').map(Number);
  return { year, month: m };
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Workload coefficient
 */
export function getCoefficient(status: string): number {
  switch (status) {
    case '通常':
      return 1.0;
    case '半休':
      return 0.5;
    case '休み':
    case '有給':
      return 0;
    default:
      return 0;
  }
}

/**
 * Calculate profit metrics
 */
export function calculateProfit(
  sellPrice: number,
  payPrice: number,
  coefficient: number,
  transport: number = 0
): {
  sell: number;
  cost: number;
  profit: number;
} {
  const sell = sellPrice * coefficient;
  const cost = payPrice * coefficient + transport;
  const profit = sell - cost;

  return { sell, cost, profit };
}

/**
 * CSV export helper
 */
export function exportToCSV(data: any[], filename: string) {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row =>
      Object.values(row)
        .map(v => {
          if (typeof v === 'string' && (v.includes(',') || v.includes('"'))) {
            return `"${v.replace(/"/g, '""')}"`;
          }
          return v;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Class name utility
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
