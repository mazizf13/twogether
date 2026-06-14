import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { CountdownCard } from '@/components/organisms/dashboard/CountdownCard'
import { ChecklistProgress } from '@/components/organisms/wedding/ChecklistProgress'
import { PiggyBank, ArrowRight, Heart } from 'lucide-react'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'
import { cn } from '@/lib/utils'

export default function Hub({
  couple,
  countdown,
  checklist_summary,
  savings_summary,
}: any) {
  const { auth } = usePage().props as any
  const user = auth.user

  return (
    <AppShell title="Pusat Pernikahan" coupleName={couple.name} userName={user.display_name} userAvatar={user.avatar_url}>
      
      {/* Hero Section with Countdown */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-400 rounded-[2.5rem] shadow-lg overflow-hidden h-[240px] md:h-[280px]">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')] mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 pt-10 px-6 md:px-12">
          <div className="text-white mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Our Wedding</h1>
            <p className="text-pink-100 font-medium opacity-90">Plan your forever, together.</p>
          </div>
          
          {/* Prominent Countdown */}
          <div className="max-w-2xl">
            <CountdownCard days={countdown.days} date={countdown.date} message={countdown.message} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-20 md:mt-12">
        
        {/* Left Column: Checklist Summary */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Your Checklist</h2>
            <Link href={route('wedding.checklist.index')} className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center">
              Lihat semua <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-white dark:bg-neutral-950 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8 flex-1 flex flex-col group hover:shadow-md transition-shadow">
            
            <div className="mb-8">
              <ChecklistProgress {...checklist_summary} />
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Progress by Category</h3>
              {checklist_summary.by_category.slice(0, 4).map((cat: any) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-neutral-700 dark:text-neutral-200">{cat.name}</span>
                    <span className="text-neutral-500 dark:text-neutral-400 font-medium">{cat.completed}/{cat.total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-500", cat.pct === 100 ? "bg-green-500" : "bg-pink-500")}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              {checklist_summary.by_category.length > 4 && (
                <div className="text-sm text-neutral-400 font-medium text-center pt-2">
                  + {checklist_summary.by_category.length - 4} more categories
                </div>
              )}
              {checklist_summary.by_category.length === 0 && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 italic py-4">No tasks added yet.</div>
              )}
            </div>

            <Link 
              href={route('wedding.checklist.index')}
              className="w-full flex items-center justify-center px-4 py-3 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 rounded-xl font-bold hover:bg-neutral-100 dark:bg-neutral-800 transition-colors group-hover:bg-pink-50 group-hover:text-pink-600"
            >
              Continue Planning
            </Link>
          </div>
        </div>

        {/* Right Column: Savings Summary */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Tabungan Pernikahan</h2>
            <Link href={route('savings.index')} className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center">
              Lihat semua <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-white dark:bg-neutral-950 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8 flex-1 flex flex-col group hover:shadow-md transition-shadow">
            
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
              <PiggyBank className="w-6 h-6 text-pink-500" />
            </div>

            <div className="mb-2">
              <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Total Saved</div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 flex items-baseline space-x-2">
                <CurrencyAmount cents={savings_summary.total_saved_cents} currencyCode={couple.currency_code} />
              </div>
            </div>

            {savings_summary.target_cents ? (
              <div className="mt-6 mb-8 flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-pink-600">{savings_summary.progress_pct}%</span>
                  <span className="text-neutral-500 dark:text-neutral-400">of <CurrencyAmount cents={savings_summary.target_cents} currencyCode={couple.currency_code} /> target</span>
                </div>
                <div className="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", savings_summary.progress_pct >= 100 ? "bg-green-500" : "bg-pink-500")}
                    style={{ width: `${Math.min(100, savings_summary.progress_pct)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 mb-8 flex-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Set a target in the Savings section to track your progress.</p>
              </div>
            )}

            <Link 
              href={route('savings.index')}
              className="w-full flex items-center justify-center px-4 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-sm"
            >
              + Add Contribution
            </Link>
          </div>
        </div>

      </div>

    </AppShell>
  )
}


