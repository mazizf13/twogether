import React from 'react'
import { Link } from '@inertiajs/react'
import { FinancialSummary } from '@/types'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FinancialHealthCardProps {
  summary: FinancialSummary
  currencyCode: string
}

export function FinancialHealthCard({ summary, currencyCode }: FinancialHealthCardProps) {
  const isPositive = summary.net_cashflow_cents >= 0
  const isBetterThanLastMonth = summary.vs_last_month_pct >= 0

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat(currencyCode === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'IDR' ? 0 : 2,
    }).format(cents / 100)
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-pink-500" />
          Kesehatan Keuangan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Net Cashflow */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Arus Kas Bersih</span>
            <span className={cn(
              "text-3xl font-bold tracking-tight",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {formatCurrency(summary.net_cashflow_cents)}
            </span>
            <div className="flex items-center mt-2 text-xs font-medium">
              <span className={cn(
                "flex items-center",
                isBetterThanLastMonth ? "text-green-600" : "text-red-600"
              )}>
                {isBetterThanLastMonth ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(summary.vs_last_month_pct)}% dari bulan lalu
              </span>
            </div>
          </div>

          {/* Income */}
          <div className="flex flex-col relative group">
            <Link href={route('income.personal')} className="absolute inset-0 z-10">
              <span className="sr-only">Kelola Pemasukan</span>
            </Link>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pemasukan</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-pink-500 transition-colors" />
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-pink-600 transition-colors">
              {formatCurrency(summary.total_income_this_month_cents)}
            </span>
          </div>

          {/* Expenses */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Pengeluaran</span>
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatCurrency(summary.total_expenses_this_month_cents + summary.shared_share_this_month_cents)}
            </span>
            <div className="flex flex-col mt-2 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
              <span>Pribadi: {formatCurrency(summary.total_expenses_this_month_cents)}</span>
              <span>Bersama (porsimu): {formatCurrency(summary.shared_share_this_month_cents)}</span>
            </div>
          </div>
        </div>

        {/* Savings Rate Badge */}
        <div className="mt-6 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-100 dark:bg-neutral-800">
          <span className="text-neutral-600 dark:text-neutral-300 mr-2">Tingkat Tabungan:</span>
          <span className={cn(
            summary.savings_rate_pct >= 20 ? "text-green-600" : 
            summary.savings_rate_pct >= 10 ? "text-amber-600" : "text-red-600"
          )}>
            {summary.savings_rate_pct}%
          </span>
        </div>
      </div>
      
      {/* Sparkline decoration (placeholder for visual effect) */}
      <div className="h-12 bg-gradient-to-t from-pink-50/80 dark:from-pink-900/20 to-transparent mt-auto border-t border-neutral-100 dark:border-neutral-800 flex items-end px-6 overflow-hidden space-x-1 opacity-70">
        {[40, 60, 30, 80, 50, 90, 70, 100, 60, 80, 40, 70].map((h, i) => (
          <div 
            key={i} 
            className="w-full bg-pink-200 rounded-t-sm" 
            style={{ height: `${h}%`, opacity: 0.5 + (i * 0.05) }}
          />
        ))}
      </div>
    </div>
  )
}
