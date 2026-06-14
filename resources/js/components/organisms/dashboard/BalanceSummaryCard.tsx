import React from 'react'
import { Link } from '@inertiajs/react'
import { CheckCircle2, ArrowRight } from 'lucide-react'

interface BalanceSummaryProps {
  netCents: number
  owedByName: string | null
  owedToName: string | null
  isSettled: boolean
  currencyCode: string
}

export function BalanceSummaryCard({ 
  netCents, 
  owedByName, 
  owedToName, 
  isSettled,
  currencyCode 
}: BalanceSummaryProps) {
  
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Balance</h3>
        <Link href={route('expenses.shared')} className="text-sm font-medium text-pink-600 hover:text-pink-700">
          Details &rarr;
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {isSettled ? (
          <div className="text-center py-4 space-y-3">
            <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">You're all square</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No balance between you right now.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              {netCents > 0 ? `${owedByName} owes you` : `You owe ${owedToName}`}
            </p>
            <div className="text-3xl font-bold text-pink-600 tabular-nums tracking-tight">
              {formatCurrency(Math.abs(netCents))}
            </div>
            <p className="text-xs text-neutral-400 mt-1">Based on shared expenses</p>
            
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button className="flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:text-neutral-100 transition-colors group">
                Settle up 
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
