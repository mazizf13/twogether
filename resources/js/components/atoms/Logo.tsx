import React from 'react'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white'
  className?: string
}

export function Logo({ size = 'md', variant = 'default', className }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4 ml-1',
    md: 'w-5 h-5 ml-1',
    lg: 'w-8 h-8 ml-2',
    xl: 'w-10 h-10 ml-2',
  }

  const variantClasses = {
    default: 'text-pink-600',
    white: 'text-white',
  }

  return (
    <div
      className={cn(
        'flex items-center font-bold tracking-tight select-none font-serif',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      twogether
      <Heart 
        className={cn('fill-current', iconSizeClasses[size])} 
      />
    </div>
  )
}
