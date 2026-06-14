import React from 'react'
import { Link } from '@inertiajs/react'
import { PiggyBank, ChevronRight } from 'lucide-react'

interface CompactSavingsCardProps {
  progressPct: number
  totalSavedCents: number
  targetCents: number | null
  currencyCode: string
  title?: string
  href?: string
}

export function CompactSavingsCard({ progressPct, totalSavedCents, targetCents, currencyCode, title = 'Tabungan Pernikahan', href }: CompactSavingsCardProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat(currencyCode === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'IDR' ? 0 : 2,
    }).format(cents / 100)
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 flex flex-col justify-between h-full hover:border-pink-200 transition-colors group relative overflow-hidden">
      <Link href={href || route('savings.index')} className="absolute inset-0 z-10">
        <span className="sr-only">Lihat Tabungan</span>
      </Link>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
            <PiggyBank className="w-4 h-4" />
          </div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm truncate">{title}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-pink-500 transition-colors" />
      </div>
      
      <div className="space-y-2 relative z-0">
        <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-pink-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {formatCurrency(totalSavedCents)} <span className="text-neutral-500 dark:text-neutral-400 font-normal">terkumpul</span>
          </span>
          <span className="font-bold text-pink-600">{progressPct}%</span>
        </div>
      </div>
    </div>
  )
}
