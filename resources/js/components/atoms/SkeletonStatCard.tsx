import React from 'react'

export function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-neutral-950 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8 animate-pulse">
      <div className="w-12 h-12 bg-neutral-200 rounded-2xl mb-6" />
      <div className="w-24 h-4 bg-neutral-100 dark:bg-neutral-800 rounded-md mb-2" />
      <div className="w-32 h-8 bg-neutral-200 rounded-md" />
    </div>
  )
}
