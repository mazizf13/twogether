import React from 'react'
import { cn } from '@/lib/utils'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'

interface MilestoneProgressProps {
  progressPct: number
  totalCents: number
  targetCents: number | null
  currencyCode: string
}

export function MilestoneProgress({ progressPct, totalCents, targetCents, currencyCode }: MilestoneProgressProps) {
  const milestones = [25, 50, 75, 100]

  return (
    <div className="w-full">
      <div className="relative pt-6 pb-2">
        {/* Progress Bar Track */}
        <div className="w-full h-4 bg-pink-100 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>

        {/* Milestone Markers */}
        {targetCents && milestones.map(milestone => {
          const isReached = progressPct >= milestone
          return (
            <div 
              key={milestone}
              className="absolute top-[28px] -translate-y-1/2 -ml-2 group cursor-pointer"
              style={{ left: `${milestone}%` }}
            >
              <div className={cn(
                "w-4 h-4 rotate-45 border-2 bg-white dark:bg-neutral-950 transition-colors duration-500 shadow-sm",
                isReached ? "border-pink-500 bg-pink-500" : "border-pink-200"
              )} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {milestone}% (
                <CurrencyAmount 
                  cents={targetCents * (milestone / 100)} 
                  currencyCode={currencyCode} 
                  className="text-white"
                />)
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-pink-600">
            <CurrencyAmount cents={totalCents} currencyCode={currencyCode} /> saved
          </span>
        </div>
        
        {targetCents && (
          <div className="flex flex-col items-end">
            {progressPct >= 100 ? (
              <span className="text-sm font-semibold text-green-600">Goal reached! 🎉</span>
            ) : (
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                <CurrencyAmount cents={targetCents - totalCents} currencyCode={currencyCode} /> remaining
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

