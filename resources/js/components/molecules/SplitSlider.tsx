import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SplitSliderProps {
  partnerAName: string
  partnerBName: string
  partnerASplit: number // 0-100
  onChange: (partnerASplit: number) => void
  isPartnerACurrentUser?: boolean
  error?: string
}

export function SplitSlider({ 
  partnerAName, 
  partnerBName, 
  partnerASplit, 
  onChange,
  isPartnerACurrentUser = true,
  error 
}: SplitSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Handle drag/click to set percentage
  const handleMove = (clientX: number) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    let rawPct = ((clientX - rect.left) / rect.width) * 100
    
    // Clamp between 0 and 100
    rawPct = Math.max(0, Math.min(100, rawPct))
    
    // Snap to 50 if very close
    if (Math.abs(rawPct - 50) < 3) {
      rawPct = 50
    } else {
      rawPct = Math.round(rawPct)
    }
    
    onChange(rawPct)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    handleMove(e.clientX)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const setPreset = (pct: number) => {
    onChange(pct)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{partnerAName}</span>
          <span className="text-xs font-medium text-pink-600">{partnerASplit}%</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{partnerBName}</span>
          <span className="text-xs font-medium text-pink-600">{100 - partnerASplit}%</span>
        </div>
      </div>

      <div 
        className="relative h-10 w-full touch-none select-none cursor-pointer"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Track */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="h-full bg-pink-500 transition-all duration-100 ease-out" 
              style={{ width: `${partnerASplit}%` }} 
            />
            <div 
              className="h-full bg-pink-300 transition-all duration-100 ease-out" 
              style={{ width: `${100 - partnerASplit}%` }} 
            />
          </div>
        </div>

        {/* 50% Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-5 bg-white dark:bg-neutral-950 rounded-full pointer-events-none shadow-sm z-0" />

        {/* Handle */}
        <div 
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-neutral-950 border-2 border-pink-500 rounded-full shadow-md z-10 transition-transform duration-100 ease-out",
            isDragging ? "scale-125" : "scale-100"
          )}
          style={{ 
            left: `calc(${partnerASplit}% - 12px)`,
          }}
        />
      </div>

      {/* Presets */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setPreset(isPartnerACurrentUser ? 100 : 0)}
          className={cn(
            "flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors border",
            partnerASplit === (isPartnerACurrentUser ? 100 : 0) ? "bg-pink-50 border-pink-200 text-pink-700" : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900"
          )}
        >
          Tanggung Semua
        </button>
        <button
          type="button"
          onClick={() => setPreset(50)}
          className={cn(
            "flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors border",
            partnerASplit === 50 ? "bg-pink-50 border-pink-200 text-pink-700" : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900"
          )}
        >
          50 / 50
        </button>
        <button
          type="button"
          onClick={() => setPreset(isPartnerACurrentUser ? 0 : 100)}
          className={cn(
            "flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors border",
            partnerASplit === (isPartnerACurrentUser ? 0 : 100) ? "bg-pink-50 border-pink-200 text-pink-700" : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900"
          )}
        >
          Mereka Tanggung
        </button>
      </div>
      
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}
