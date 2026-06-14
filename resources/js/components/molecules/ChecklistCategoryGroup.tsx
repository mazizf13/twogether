import React, { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react'
import { ChecklistRow } from './ChecklistRow'
import { cn } from '@/lib/utils'

interface ChecklistCategoryGroupProps {
  category: string
  items: any[]
  completedCount: number
  totalCount: number
  couple: any
  onItemToggle: (item: any) => void
  onItemEdit: (item: any) => void
  onItemDelete: (item: any) => void
}

export function ChecklistCategoryGroup({
  category,
  items,
  completedCount,
  totalCount,
  couple,
  onItemToggle,
  onItemEdit,
  onItemDelete
}: ChecklistCategoryGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const isAllDone = completedCount === totalCount && totalCount > 0

  if (items.length === 0) return null

  return (
    <div className="mb-6 border border-neutral-100 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:bg-neutral-900 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          )}
          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{category}</h4>
          
          <div className="flex items-center space-x-2">
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              isAllDone ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600 dark:text-neutral-300"
            )}>
              {completedCount}/{totalCount}
            </span>
            {isAllDone && (
              <span className="flex items-center text-xs font-bold text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> All done
              </span>
            )}
          </div>
        </div>
      </button>

      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[5000px] opacity-100 border-t border-neutral-100 dark:border-neutral-800" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="p-2 space-y-1">
          {items.map(item => (
            <ChecklistRow 
              key={item.id}
              item={item}
              couple={couple}
              onToggle={onItemToggle}
              onEdit={onItemEdit}
              onDelete={onItemDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
