import React from 'react'
import { Link } from '@inertiajs/react'
import { Plus } from 'lucide-react'

interface GoalProps {
  id: number
  name: string
  progress_pct: number
}

interface SavingsSummaryProps {
  totalSavedCents: number
  targetCents: number | null
  progressPct: number
  myContributionCents: number
  partnerContributionCents: number
  currencyCode: string
  topGoals: GoalProps[]
  coupleName: string
}

export function SavingsSummaryCard({
  totalSavedCents,
  targetCents,
  progressPct,
  myContributionCents,
  partnerContributionCents,
  currencyCode,
  topGoals,
  coupleName
}: SavingsSummaryProps) {
  
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Savings</h3>
        <Link href={route('savings.index')} className="text-sm font-medium text-pink-600 hover:text-pink-700">
          Lihat semua &rarr;
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums tracking-tight">
            {formatCurrency(totalSavedCents)}
          </span>
          {targetCents && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              of {formatCurrency(targetCents)}
            </span>
          )}
        </div>
        
        {targetCents && (
          <div className="mt-4 space-y-1">
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden relative">
              <div 
                className="bg-pink-500 h-full transition-all duration-1000 ease-out rounded-full" 
                style={{ width: `${progressPct}%` }}
              />
              {/* Markers */}
              <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white dark:bg-neutral-950/50" />
              <div className="absolute top-0 bottom-0 left-2/4 w-px bg-white dark:bg-neutral-950/50" />
              <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white dark:bg-neutral-950/50" />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-neutral-400">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>

      {/* Kontribusi Split */}
      <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-neutral-50">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Your contribution</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {formatCurrency(myContributionCents)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Partner's contribution</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {formatCurrency(partnerContributionCents)}
          </span>
        </div>
      </div>

      {/* Top Goals */}
      {topGoals && topGoals.length > 0 && (
        <div className="mb-6 flex-1">
          <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
            Target Aktif
          </h4>
          <div className="space-y-3">
            {topGoals.map((goal) => (
              <div key={goal.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-neutral-700 dark:text-neutral-200">{goal.name}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">{goal.progress_pct}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-pink-400 h-full rounded-full" 
                    style={{ width: `${goal.progress_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      <button className="mt-auto w-full flex items-center justify-center space-x-2 py-2.5 bg-pink-50 text-pink-600 rounded-xl font-medium hover:bg-pink-100 transition-colors">
        <Plus className="w-4 h-4" />
        <span>Tambah Kontribusi</span>
      </button>
    </div>
  )
}



