import React from 'react'
import { cn } from '@/lib/utils'

interface CurrencyAmountProps {
  cents: number
  currencyCode: string
  size?: 'sm' | 'md' | 'lg' | 'display'
  color?: 'default' | 'pink' | 'success' | 'danger'
  showSign?: boolean
  className?: string
}

export function CurrencyAmount({ 
  cents, 
  currencyCode, 
  size = 'md', 
  color = 'default',
  showSign = false,
  className 
}: CurrencyAmountProps) {
  
  const formatCurrency = (amountCents: number) => {
    const value = amountCents / 100
    // IDR often doesn't show decimals in casual apps
    const isIDR = currencyCode.toUpperCase() === 'IDR'
    const locale = isIDR ? 'id-ID' : 'en-US'
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: isIDR ? 0 : 2,
      maximumFractionDigits: isIDR ? 0 : 2,
      signDisplay: showSign ? 'always' : 'auto'
    }).format(value)
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
    display: 'text-3xl md:text-4xl font-bold tracking-tight',
  }

  const colorClasses = {
    default: 'text-neutral-900 dark:text-neutral-100',
    pink: 'text-pink-600',
    success: 'text-green-600',
    danger: 'text-rose-600',
  }

  return (
    <span className={cn(
      "tabular-nums",
      sizeClasses[size],
      colorClasses[color],
      className
    )}>
      {formatCurrency(cents)}
    </span>
  )
}
