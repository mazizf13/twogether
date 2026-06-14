import React from 'react'

export function SkeletonGoalCard() {
  return (
    <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="w-1/2 h-5 bg-neutral-200 rounded-md" />
          <div className="w-1/3 h-4 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
        </div>
      </div>
      <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4" />
      <div className="flex justify-between items-center">
        <div className="w-20 h-6 bg-neutral-200 rounded-md" />
        <div className="w-16 h-6 bg-neutral-200 rounded-md" />
      </div>
    </div>
  )
}
