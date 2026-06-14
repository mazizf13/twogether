import React from 'react'
import { Head } from '@inertiajs/react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { useToastFlash } from '@/hooks/use-toast-flash'

interface AppShellProps {
  children: React.ReactNode
  title?: string
  coupleName: string | null
  userName: string
  userAvatar?: string | null
  className?: string
}

export function AppShell({ 
  children, 
  title, 
  coupleName, 
  userName, 
  userAvatar,
  className 
}: AppShellProps) {
  useToastFlash()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col lg:flex-row w-full overflow-x-hidden">
      {title && <Head title={`${title} - Twogether`} />}

      {/* Desktop Sidebar */}
      <Sidebar 
        coupleName={coupleName} 
        userName={userName} 
        userAvatar={userAvatar} 
      />

      {/* Mobile Header */}
      <Header 
        title={title} 
        userName={userName} 
        userAvatar={userAvatar} 
      />

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        "pt-14 pb-16 lg:pt-0 lg:pb-0 lg:pl-64", // Accommodate mobile header/nav and desktop sidebar
        className
      )}>
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Toaster for global notifications */}
      <Toaster position="top-right" richColors expand={false} className="hidden sm:block" />
      <Toaster position="bottom-center" richColors expand={false} className="sm:hidden" />
    </div>
  )
}
