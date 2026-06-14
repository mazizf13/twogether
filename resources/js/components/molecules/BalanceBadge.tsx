import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BalanceBadgeProps {
  netCents: number
  owedByName: string | null
  owedToName: string | null
  isSettled: boolean
  currencyCode: string
}

export function BalanceBadge({ 
  netCents, 
  owedByName, 
  owedToName, 
  isSettled, 
  currencyCode 
}: BalanceBadgeProps) {
  
  if (isSettled) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200 shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Settled</span>
      </div>
    )
  }

  const amount = Math.abs(netCents) / 100
  const isIDR = currencyCode.toUpperCase() === 'IDR'
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: isIDR ? 0 : 2,
    maximumFractionDigits: isIDR ? 0 : 2,
  }).format(amount)

  const viewerOwes = netCents < 0

  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm",
      viewerOwes 
        ? "bg-orange-50 text-orange-700 border-orange-200" 
        : "bg-pink-50 text-pink-700 border-pink-200"
    )}>
      {viewerOwes ? (
        <span>You owe {owedToName} {formattedAmount}</span>
      ) : (
        <span>{owedByName} owes you {formattedAmount}</span>
      )}
    </div>
  )
}
