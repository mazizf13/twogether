import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AmountInputProps {
  value: number // in cents
  onChange: (cents: number) => void
  currencyCode: string
  error?: string
  className?: string
}

export function AmountInput({ value, onChange, currencyCode, error, className }: AmountInputProps) {
  const isIDR = currencyCode.toUpperCase() === 'IDR'
  
  // Format cents to display string
  const formatDisplay = (cents: number) => {
    if (cents === 0) return ''
    const val = cents / 100
    // Use Intl for thousands separators, but keep it simple for input
    if (isIDR) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return val.toString() // For decimals, might need more robust handling
  }

  const [displayValue, setDisplayValue] = useState(formatDisplay(value))

  // Update display when external value changes
  useEffect(() => {
    setDisplayValue(formatDisplay(value))
  }, [value, currencyCode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9.]/g, '') // strip non-numeric
    
    // For IDR, prevent decimals
    if (isIDR) {
      raw = raw.replace(/\./g, '')
    }

    setDisplayValue(raw)

    const numericVal = parseFloat(raw)
    if (!isNaN(numericVal)) {
      onChange(Math.round(numericVal * 100))
    } else {
      onChange(0)
    }
  }

  const handleBlur = () => {
    if (value > 0) {
      setDisplayValue(formatDisplay(value))
    } else {
      setDisplayValue('')
    }
  }

  const clear = () => {
    setDisplayValue('')
    onChange(0)
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "flex items-center w-full rounded-xl border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-neutral-950 overflow-hidden focus-within:ring-2 focus-within:ring-pink-500/20 transition-all",
        error ? "border-rose-500 focus-within:border-rose-500" : "focus-within:border-pink-500"
      )}>
        <div className="pl-4 pr-2 py-3 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 flex items-center justify-center shrink-0">
          <span className="font-semibold text-neutral-500 dark:text-neutral-400">
            {currencyCode === 'IDR' ? 'Rp' : currencyCode === 'USD' ? '$' : currencyCode}
          </span>
        </div>
        
        <input
          type={isIDR ? "tel" : "text"}
          inputMode={isIDR ? "numeric" : "decimal"}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="flex-1 w-full py-3 pl-4 pr-10 text-right font-semibold text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-neutral-300"
          placeholder="0"
        />

        {value > 0 && (
          <button 
            type="button"
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      )}
    </div>
  )
}
