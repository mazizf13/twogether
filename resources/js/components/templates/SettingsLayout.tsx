import React from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { User, Heart, Bell, Lock, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LeaveCoupleModal } from '@/components/modals/LeaveCoupleModal'

interface SettingsLayoutProps {
  children: React.ReactNode
  currentSection: string
  coupleName?: string
  partnerName?: string
}

export function SettingsLayout({ children, currentSection, coupleName, partnerName }: SettingsLayoutProps) {
  const { auth } = usePage().props as any
  const [isLeaveModalOpen, setIsLeaveModalOpen] = React.useState(false)

  const navItems = [
    { label: 'Profile', route: 'settings.profile.show', icon: User },
    { label: 'Couple Settings', route: 'settings.couple.show', icon: Heart },
    { label: 'Notifications', route: 'settings.notifications.show', icon: Bell },
    { label: 'Security', route: 'settings.security.show', icon: Lock },
  ]

  const handleLeave = () => {
    router.delete(route('couple.leave'))
  }

  return (
    <AppShell title="Pengaturan" coupleName={auth.user.couple?.name || 'Settings'} userName={auth.user.display_name} userAvatar={auth.user.avatar_url}>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Nav (Dropdown) */}
        <div className="md:hidden">
          <select
            value={route(navItems.find(i => i.label === currentSection)?.route || 'settings.profile.show')}
            onChange={(e) => router.visit(e.target.value)}
            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {navItems.map(item => (
              <option key={item.route} value={route(item.route)}>{item.label}</option>
            ))}
          </select>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isAktif = currentSection === item.label
            return (
              <Link
                key={item.label}
                href={route(item.route)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl font-medium transition-colors",
                  isAktif 
                    ? "bg-pink-50 text-pink-700" 
                    : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 hover:text-neutral-900 dark:text-neutral-100"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3", isAktif ? "text-pink-500" : "text-neutral-400")} />
                {item.label}
              </Link>
            )
          })}

          {coupleName && partnerName && (
            <>
              <div className="h-px bg-neutral-200 my-4 mx-4" />
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="flex items-center px-4 py-3 rounded-xl font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5 mr-3 text-rose-500" />
                Leave Couple Space
              </button>
            </>
          )}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>

      {coupleName && partnerName && (
        <LeaveCoupleModal 
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onConfirm={handleLeave}
          coupleName={coupleName}
          partnerName={partnerName}
        />
      )}
    </AppShell>
  )
}



