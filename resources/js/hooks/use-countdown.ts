import { useState, useEffect } from 'react'
import { differenceInDays, startOfDay, isToday as checkIsToday, isPast as checkIsPast } from 'date-fns'

interface CountdownState {
  days: number | null
  weeks: number | null
  months: number | null
  state: 'empty' | 'past' | 'today' | 'soon' | 'future'
  isToday: boolean
  isPast: boolean
  isSoon: boolean // <= 30 days
}

export function useCountdown(weddingDateStr: string | null | undefined): CountdownState {
  const calculate = (): CountdownState => {
    if (!weddingDateStr) {
      return { days: null, weeks: null, months: null, state: 'empty', isToday: false, isPast: false, isSoon: false }
    }

    const today = startOfDay(new Date())
    const weddingDate = startOfDay(new Date(weddingDateStr))
    
    const days = differenceInDays(weddingDate, today)
    const isToday = checkIsToday(weddingDate)
    const isPast = days < 0 && !isToday
    const isSoon = days > 0 && days <= 30
    
    let state: CountdownState['state'] = 'future'
    if (isPast) state = 'past'
    else if (isToday) state = 'today'
    else if (isSoon) state = 'soon'

    return {
      days: days > 0 ? days : 0,
      weeks: days > 0 ? Math.floor(days / 7) : 0,
      months: days > 0 ? Math.floor(days / 30) : 0,
      state,
      isToday,
      isPast,
      isSoon
    }
  }

  const [countdown, setCountdown] = useState<CountdownState>(calculate())

  useEffect(() => {
    // Recalculate immediately on mount/change
    setCountdown(calculate())

    // Set up a timer to recalculate at exactly midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setHours(24, 0, 0, 0)
    const timeToMidnight = tomorrow.getTime() - now.getTime()

    // Timeout until midnight
    const timeoutId = setTimeout(() => {
      setCountdown(calculate())
      // Then recalculate every 24 hours
      const intervalId = setInterval(() => setCountdown(calculate()), 24 * 60 * 60 * 1000)
      // Cleanup the interval if unmounted later
      return () => clearInterval(intervalId)
    }, timeToMidnight)

    return () => clearTimeout(timeoutId)
  }, [weddingDateStr])

  return countdown
}
