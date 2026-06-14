import React from 'react'
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'

interface DateDisplayProps {
  date: string | Date
  formatStyle?: 'short' | 'medium' | 'long' | 'relative'
  className?: string
}

export function DateDisplay({ date, formatStyle = 'medium', className }: DateDisplayProps) {
  if (!date) return null

  const d = typeof date === 'string' ? parseISO(date) : date

  let display = ''

  if (formatStyle === 'relative') {
    if (isToday(d)) {
      display = 'Today'
    } else if (isYesterday(d)) {
      display = 'Yesterday'
    } else if (isTomorrow(d)) {
      display = 'Tomorrow'
    } else {
      display = formatDistanceToNow(d, { addSuffix: true })
    }
  } else if (formatStyle === 'short') {
    display = format(d, 'd MMM') // e.g., 14 Dec
  } else if (formatStyle === 'long') {
    display = format(d, 'EEEE, d MMMM yyyy') // e.g., Saturday, 14 December 2025
  } else {
    display = format(d, 'd MMMM yyyy') // e.g., 14 December 2025
  }

  return (
    <span className={className}>
      {display}
    </span>
  )
}
