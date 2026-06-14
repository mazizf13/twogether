import React from 'react'
import { Head } from '@inertiajs/react'
import { Logo } from '@/components/atoms/Logo'
import { cn } from '@/lib/utils'

interface OnboardingLayoutProps {
  children: React.ReactNode
  title: string
  currentStep?: number
  totalSteps?: number
}

export function OnboardingLayout({ 
  children, 
  title, 
  currentStep, 
  totalSteps = 5 
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      <Head title={title} />
      
      {/* Header */}
      <header className="w-full bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <Logo size="md" />
        
        {/* Step Indicator */}
        {currentStep && (
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNumber = idx + 1
              const isAktif = stepNumber === currentStep
              const isSelesai = stepNumber < currentStep
              
              return (
                <div 
                  key={stepNumber}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    isAktif ? "bg-pink-500 scale-125" : 
                    isSelesai ? "bg-pink-300" : "bg-neutral-200"
                  )}
                  aria-label={`Step ${stepNumber}`}
                  aria-current={isAktif ? 'step' : undefined}
                />
              )
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center pt-12 pb-24 px-4 sm:px-6">
        <div className="w-full max-w-lg transition-all duration-300 ease-in-out relative">
          {children}
        </div>
      </main>
      
      {/* Decorative background element */}
      <div className="fixed bottom-0 left-0 w-full h-64 bg-gradient-to-t from-pink-50 to-transparent pointer-events-none -z-10" />
    </div>
  )
}


