import React from 'react'
import { Link } from '@inertiajs/react'
import { Heart, Calendar as CalendarIcon, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CountdownProps {
  days: number | null
  date: string | null
  message: string
}

export function CountdownCard({ days, date, message }: CountdownProps) {
  // No date set state
  if (days === null) {
    return (
      <div className="w-full bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 border border-pink-200 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
          <div className="space-y-2 mb-6 md:mb-0">
            <h3 className="text-2xl font-serif font-bold text-pink-900">When is the big day?</h3>
            <p className="text-pink-700/80 max-w-sm">
              Atur tanggal pernikahanmu to start the countdown and unlock timeline features.
            </p>
          </div>
          <Link 
            href={route('settings.couple')} 
            className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors shadow-pink-sm w-fit"
          >
            Set Tanggal Pernikahan &rarr;
          </Link>
        </div>
        <CalendarIcon className="absolute -right-4 -bottom-4 w-48 h-48 text-pink-500/10 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
      </div>
    )
  }

  // Married / Past date state
  if (days < 0) {
    return (
      <div className="w-full bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-8 text-white shadow-pink-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-neutral-950/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <PartyPopper className="w-4 h-4" />
            <span>Since {date}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2">{message}</h2>
          <p className="text-pink-100 text-lg">Wishing you a lifetime of love and happiness.</p>
        </div>
        <Heart className="absolute -right-8 -bottom-8 w-64 h-64 text-white/10 fill-current animate-pulse duration-3000" />
      </div>
    )
  }

  // Today!
  if (days === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 rounded-2xl p-8 text-white shadow-pink-md relative overflow-hidden animate-in zoom-in-95 duration-700">
        <div className="relative z-10 text-center space-y-4 py-4">
          <h2 className="text-5xl md:text-6xl font-serif font-bold drop-shadow-sm">{message}</h2>
          <p className="text-xl md:text-2xl text-pink-100 font-medium">{date}</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-10 w-4 h-4 bg-white dark:bg-neutral-950/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="absolute top-12 right-20 w-3 h-3 bg-white dark:bg-neutral-950/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-white dark:bg-neutral-950/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  // Aktif Countdown state
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  return (
    <div className="w-full bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 md:p-10 text-white shadow-pink-md relative overflow-hidden flex flex-col md:flex-row md:items-end justify-between min-h-[220px]">
      <div className="relative z-10">
        <p className="text-pink-100/80 text-sm md:text-base font-medium mb-1 uppercase tracking-wider">
          Days until your wedding
        </p>
        <div className="text-7xl md:text-8xl font-bold tracking-tighter tabular-nums leading-none mb-4 font-serif">
          {days}
        </div>
        <div className="inline-flex items-center space-x-2 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full text-pink-50 font-medium">
          <CalendarIcon className="w-4 h-4" />
          <span>{date}</span>
        </div>
      </div>

      {/* Secondary stats (desktop) */}
      <div className="relative z-10 mt-8 md:mt-0 flex space-x-3">
        {months > 0 && (
          <div className="bg-white dark:bg-neutral-950/20 backdrop-blur-md px-4 py-3 rounded-2xl text-center min-w-[80px]">
            <div className="text-2xl font-bold tabular-nums leading-tight">{months}</div>
            <div className="text-xs text-pink-100 font-medium">Months</div>
          </div>
        )}
        {weeks > 0 && (
          <div className="bg-white dark:bg-neutral-950/20 backdrop-blur-md px-4 py-3 rounded-2xl text-center min-w-[80px]">
            <div className="text-2xl font-bold tabular-nums leading-tight">{weeks}</div>
            <div className="text-xs text-pink-100 font-medium">Weeks</div>
          </div>
        )}
      </div>

      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-400/20 rounded-full blur-2xl mix-blend-overlay" />
      </div>
    </div>
  )
}

