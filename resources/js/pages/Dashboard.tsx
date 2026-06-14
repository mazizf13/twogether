import React from 'react'
import { Head, usePage } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { FinancialHealthCard } from '@/components/organisms/dashboard/FinancialHealthCard'
import { CompactCountdownCard } from '@/components/organisms/dashboard/CompactCountdownCard'
import { CompactSavingsCard } from '@/components/organisms/dashboard/CompactSavingsCard'
import { BalanceSummaryCard } from '@/components/organisms/dashboard/BalanceSummaryCard'
import { ActivityFeed } from '@/components/organisms/dashboard/ActivityFeed'
import { ChecklistSummaryCard } from '@/components/organisms/dashboard/ChecklistSummaryCard'
import { QuickActions } from '@/components/organisms/dashboard/QuickActions'

interface DashboardProps {
  couple: {
    name: string
    currency_code: string
  }
  countdown: {
    days: number | null
    date: string | null
    message: string
  }
  balance: {
    net_cents: number
    owed_by_name: string | null
    owed_to_name: string | null
    is_settled: boolean
  }
  savings_summary: {
    total_saved_cents: number
    target_cents: number | null
    progress_pct: number
    my_contribution_cents: number
    partner_contribution_cents: number
  }
  top_goals: any[]
  recent_activity: any[]
  checklist_summary: {
    total: number
    completed: number
    terlewat: number
    pct: number
  }
  financial_summary: {
    total_income_this_month_cents: number
    total_expenses_this_month_cents: number
    shared_share_this_month_cents: number
    net_cashflow_cents: number
    savings_rate_pct: number
    vs_last_month_pct: number
  }
}

export default function Dashboard({
  couple,
  countdown,
  balance,
  savings_summary,
  top_goals,
  recent_activity,
  checklist_summary,
  financial_summary
}: DashboardProps) {
  
  const { auth } = usePage().props as any
  const user = auth.user

  return (
    <AppShell 
      title="Dasbor" 
      coupleName={couple.name}
      userName={user.display_name}
      userAvatar={user.avatar_url}
    >
      <div className="flex flex-col space-y-6 md:space-y-8 pb-10">
        
        {/* ZONE 1: FINANCIAL HEALTH (top, prominent) */}
        <div className="w-full space-y-6">
          <FinancialHealthCard 
            summary={financial_summary} 
            currencyCode={couple.currency_code} 
          />
          <BalanceSummaryCard 
            netCents={balance.net_cents}
            owedByName={balance.owed_by_name}
            owedToName={balance.owed_to_name}
            isSettled={balance.is_settled}
            currencyCode={couple.currency_code}
          />
        </div>

        {/* ZONE 2: WEDDING (bottom, compact) */}
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-1">Persiapan Pernikahan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-full">
              <CompactCountdownCard 
                days={countdown.days} 
                date={countdown.date} 
              />
            </div>
            <div className="h-full">
              <CompactSavingsCard 
                progressPct={savings_summary.progress_pct}
                totalSavedCents={savings_summary.total_saved_cents}
                targetCents={savings_summary.target_cents}
                currencyCode={couple.currency_code}
              />
            </div>
            <div className="h-full lg:col-span-1 md:col-span-2">
              <ChecklistSummaryCard 
                total={checklist_summary.total}
                completed={checklist_summary.completed}
                terlewat={checklist_summary.terlewat}
                pct={checklist_summary.pct}
              />
            </div>
          </div>
        </div>

        {/* ZONE 3: TABUNGAN LAINNYA */}
        {top_goals && top_goals.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-1">Tabungan Lainnya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {top_goals.map(goal => (
                <div key={goal.id} className="h-full">
                  <CompactSavingsCard 
                    title={goal.name}
                    progressPct={goal.progress_pct}
                    totalSavedCents={goal.current_amount_cents}
                    targetCents={goal.target_amount_cents}
                    currencyCode={couple.currency_code}
                    href={route('savings.goals.show', goal.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ZONE 4: ACTIVITY FEED */}
        <div className="w-full pt-4">
          <ActivityFeed activities={recent_activity} />
        </div>

      </div>

      <QuickActions />
    </AppShell>
  )
}



