import React from 'react'

export function SkeletonChecklistRow() {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-xl animate-pulse">
      <div className="w-5 h-5 bg-neutral-200 rounded-md mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="w-3/4 h-5 bg-neutral-200 rounded-md" />
        <div className="w-1/4 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
      </div>
      <div className="w-6 h-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
    </div>
  )
}
