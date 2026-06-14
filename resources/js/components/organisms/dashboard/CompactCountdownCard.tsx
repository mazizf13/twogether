import React from 'react'

interface CompactCountdownCardProps {
  days: number | null
  date: string | null
}

export function CompactCountdownCard({ days, date }: CompactCountdownCardProps) {
  if (days === null) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-4 flex items-center justify-between">
        <span className="text-pink-600 font-medium text-sm">Belum ada tanggal pernikahan</span>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 flex items-center justify-between text-white shadow-sm h-full">
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold tracking-tight">{days}</span>
        <span className="text-pink-100 text-sm font-medium">hari lagi</span>
      </div>
      {date && (
        <div className="text-right">
          <span className="text-pink-100 text-xs font-medium uppercase tracking-wider block">Tanggal</span>
          <span className="font-semibold text-sm">{date}</span>
        </div>
      )}
    </div>
  )
}
