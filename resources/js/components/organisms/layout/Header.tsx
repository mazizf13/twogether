import React from 'react'
import { Link } from '@inertiajs/react'
import { Bell } from 'lucide-react'
import { Logo } from '@/components/atoms/Logo'

interface HeaderProps {
  title?: string
  userAvatar?: string | null
  userName: string
}

export function Header({ title, userAvatar, userName }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-4 lg:hidden z-40">
      <div className="flex items-center">
        {title ? (
          <h1 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">{title}</h1>
        ) : (
          <Logo size="sm" />
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-neutral-500 dark:text-neutral-400 hover:text-pink-600 transition-colors">
          <Bell className="w-5 h-5" />
          {/* Notification badge dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
        </button>
        
        <Link href={route('settings.profile.show')} className="shrink-0">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs uppercase border border-pink-200">
              {userName.charAt(0)}
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}

