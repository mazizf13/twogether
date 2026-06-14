import React from 'react'

export function SkeletonExpenseRow() {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-neutral-200 rounded-full" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-neutral-200 rounded-md" />
          <div className="w-20 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
        </div>
      </div>
      <div className="space-y-2 flex flex-col items-end">
        <div className="w-24 h-5 bg-neutral-200 rounded-md" />
        <div className="w-16 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
      </div>
    </div>
  )
}
