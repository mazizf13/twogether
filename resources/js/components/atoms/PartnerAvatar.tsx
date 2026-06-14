import React from 'react'
import { cn } from '@/lib/utils'

interface PartnerAvatarProps {
  user: {
    display_name: string
    avatar_url?: string | null
  }
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

export function PartnerAvatar({ user, size = 'md', showName = false, className }: PartnerAvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <div className={cn("flex items-center space-x-3", className)} title={user.display_name}>
      <div className={cn(
        "rounded-full bg-pink-50 text-pink-600 font-bold flex items-center justify-center shrink-0 overflow-hidden border border-pink-100 shadow-sm",
        sizeClasses[size]
      )}>
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
        ) : (
          user.display_name.charAt(0).toUpperCase()
        )}
      </div>
      {showName && (
        <span className="font-medium text-neutral-900 dark:text-neutral-100 text-sm truncate max-w-[120px]">
          {user.display_name}
        </span>
      )}
    </div>
  )
}
