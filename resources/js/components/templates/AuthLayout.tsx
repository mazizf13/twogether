import React from 'react'
import { Head } from '@inertiajs/react'
import { Logo } from '@/components/atoms/Logo'
import { cn } from '@/lib/utils'

export interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-neutral-950">
      <Head title={title} />
      
      {/* Left Panel - Hidden on mobile, half width on desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-600 to-pink-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="absolute -top-24 -left-24 w-96 h-96 text-white" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/4 w-[800px] h-[800px] text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" />
          </svg>
        </div>

        <div className="relative z-10">
          <Logo variant="white" size="lg" />
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-serif font-bold text-white leading-tight mb-4">
            Plan your forever, together.
          </h1>
          <p className="text-pink-100 text-lg">
            The simplest way to track your wedding budget, share tasks, and prepare for your big day.
          </p>
        </div>
      </div>

      {/* Right Panel - Full width on mobile, half width on desktop */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 py-12">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Logo size="md" />
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

