import React from 'react'
import { Link } from '@inertiajs/react'
import { CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'

interface GoalCardProps {
  goal: any
  currencyCode: string
  onContribute: (goal: any) => void
}

export function GoalCard({ goal, currencyCode, onContribute }: GoalCardProps) {
  const isSelesai = goal.status === 'completed'
  const isArchived = goal.status === 'archived'
  
  const iconMap: Record<string, string> = {
    'venue': '🏛️',
    'honeymoon': '✈️',
    'rings': '💍',
    'photography': '📸',
    'catering': '🍽️',
    'attire': '👗',
    'default': '🎯'
  }

  const icon = goal.icon && iconMap[goal.icon] ? iconMap[goal.icon] : iconMap['default']

  if (isSelesai) {
    return (
      <Link 
        href={route('savings.goals.show', goal.id)}
        className="block bg-pink-500 rounded-3xl p-6 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 relative overflow-hidden group"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')] mix-blend-overlay" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white dark:bg-neutral-950/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
              {icon}
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-white dark:bg-neutral-950/20 rounded-full text-xs font-medium backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-1">{goal.name}</h3>
          <p className="text-pink-100 text-sm mb-6 flex-1">
            <CurrencyAmount cents={goal.target_amount_cents} currencyCode={currencyCode} className="text-white" /> target reached
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="text-sm font-medium bg-white dark:bg-neutral-950/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              {goal.completed_at ? `Done ${new Date(goal.completed_at).toLocaleDateString()}` : 'Selesai'}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className={cn(
      "bg-white dark:bg-neutral-950 rounded-3xl p-6 border shadow-sm flex flex-col group",
      isArchived ? "border-neutral-100 dark:border-neutral-800 opacity-75" : "border-neutral-200 dark:border-neutral-800 hover:border-pink-300 transition-colors"
    )}>
      <div className="flex justify-between items-start mb-4">
        <Link href={route('savings.goals.show', goal.id)} className="w-12 h-12 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-pink-50 transition-colors">
          {icon}
        </Link>
        {goal.summary.terlewat && !isArchived && (
          <div className="flex items-center space-x-1.5 px-2 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-medium border border-rose-100">
            <Clock className="w-3 h-3" />
            <span>Overdue</span>
          </div>
        )}
        {isArchived && (
          <div className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-full text-[10px] font-medium">
            Archived
          </div>
        )}
      </div>
      
      <Link href={route('savings.goals.show', goal.id)} className="block flex-1">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-1">{goal.name}</h3>
        
        <div className="mt-4 mb-2 flex justify-between text-sm">
          <span className="font-semibold text-pink-600">
            <CurrencyAmount cents={goal.summary.total_saved_cents} currencyCode={currencyCode} />
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            / <CurrencyAmount cents={goal.target_amount_cents} currencyCode={currencyCode} />
          </span>
        </div>

        <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-1">
          <div 
            className={cn(
              "h-full transition-all duration-500 ease-out",
              goal.summary.progress_pct >= 100 ? "bg-green-500" : "bg-pink-500"
            )}
            style={{ width: `${goal.summary.progress_pct}%` }}
          />
        </div>
        <div className="text-[10px] font-medium text-neutral-400 text-right">
          {goal.summary.progress_pct}% complete
        </div>
      </Link>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {goal.deadline_formatted ? `Due ${goal.deadline_formatted}` : 'No deadline'}
        </div>
        
        {!isArchived && (
          <button 
            onClick={() => onContribute(goal)}
            className="px-3 py-1.5 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg text-xs font-semibold transition-colors"
          >
            + Contribute
          </button>
        )}
      </div>
    </div>
  )
}


