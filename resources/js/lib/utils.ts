import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amountCents: number, currencyCode: string = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountCents / 100)
}

export function formatDate(date: string | Date, formatStr: string = 'dd MMM yyyy'): string {
  // Using native Intl.DateTimeFormat as a fallback if date-fns format is not fully implemented here
  // In a real implementation we would import format from 'date-fns'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function calculateCountdown(weddingDate: string): { days: number; weeks: number; months: number } {
  const now = new Date()
  const target = new Date(weddingDate)
  const diffTime = Math.abs(target.getTime() - now.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return {
    days: diffDays,
    weeks: Math.floor(diffDays / 7),
    months: Math.floor(diffDays / 30)
  }
}
