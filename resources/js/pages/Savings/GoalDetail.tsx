import React, { useState } from 'react'
import { Head, usePage, router, Link } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { ArrowLeft, PiggyBank, Edit2, Archive, CheckCircle2 } from 'lucide-react'
import { MilestoneProgress } from '@/components/molecules/MilestoneProgress'
import { ContributionRow } from '@/components/molecules/ContributionRow'
import { AddGoalContributionModal } from '@/components/modals/AddGoalContributionModal'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { cn } from '@/lib/utils'

export default function GoalDetail({
  goal,
  summary,
  contributions,
  couple,
}: any) {
  const { auth } = usePage().props as any
  const user = auth.user

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [contributionToDelete, setContributionToDelete] = useState<any | null>(null)
  const [contributionToEdit, setContributionToEdit] = useState<any | null>(null)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  
  const isSelesai = goal.status === 'completed'
  const isArchived = goal.status === 'archived'

  const iconMap: Record<string, string> = {
    'venue': '🏛️',
    'honeymoon': '✈️',
    'rings': '💍',
    'photography': '📸',
    'catering': '🍽️',
    'attire': '👗',
    'default': '🎯'
  }

  const icon = goal.icon && iconMap[goal.icon] ? iconMap[goal.icon] : iconMap['default']

  const handleDeleteContribution = () => {
    if (!contributionToDelete) return
    router.delete(route('savings.goals.contributions.destroy', [goal.id, contributionToDelete.id]), {
      preserveScroll: true,
      onSuccess: () => setContributionToDelete(null),
    })
  }

  const handleArchiveGoal = () => {
    router.delete(route('savings.goals.destroy', goal.id), {
      onSuccess: () => setIsArchiveModalOpen(false),
    })
  }

  // Group contributions by month
  const groupedKontribusi = contributions.reduce((acc: any, c: any) => {
    const month = c.contribution_date.substring(0, 7)
    if (!acc[month]) acc[month] = []
    acc[month].push(c)
    return acc
  }, {})

  return (
    <AppShell title={goal.name} coupleName={couple.name} userName={user.display_name} userAvatar={user.avatar_url} backUrl={route('savings.goals.index')}>
      
      <div className="mb-6">
        <Link href={route('savings.goals.index')} className="inline-flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-neutral-100 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Goals
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-white dark:bg-neutral-950 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-3xl">
            {icon}
          </div>
          <div className="pt-1">
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{goal.name}</h1>
              {isSelesai && (
                <div className="flex items-center space-x-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>COMPLETED</span>
                </div>
              )}
              {isArchived && (
                <div className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded text-xs font-bold">
                  ARCHIVED
                </div>
              )}
            </div>
            {goal.description && <p className="text-neutral-500 dark:text-neutral-400 text-sm">{goal.description}</p>}
          </div>
        </div>

        {!isArchived && (
          <div className="flex space-x-2 shrink-0">
            {/* Edit would go here */}
            <button 
              onClick={() => setIsArchiveModalOpen(true)}
              className="p-2 text-neutral-400 hover:text-rose-600 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-rose-200 hover:bg-rose-50 transition-colors"
              title="Archive Goal"
            >
              <Archive className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Hero Progress Card */}
      <div className={cn(
        "rounded-[2rem] border shadow-sm p-6 sm:p-8 mb-8 overflow-hidden relative",
        isSelesai ? "bg-pink-600 border-pink-700 text-white" : "bg-white dark:bg-neutral-950 border-neutral-100 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
      )}>
        {isSelesai && (
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')] mix-blend-overlay" />
        )}

        <div className="relative z-10">
          <MilestoneProgress 
            progressPct={summary.progress_pct}
            totalCents={summary.total_saved_cents}
            targetCents={summary.target_cents}
            currencyCode={couple.currency_code}
          />

          {!isSelesai && !isArchived && (
            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center px-6 py-3 bg-pink-50 text-pink-600 rounded-xl font-bold hover:bg-pink-100 transition-colors border border-pink-100"
              >
                <PiggyBank className="w-5 h-5 mr-2" />
                Contribute
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kontribusi History */}
      <div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">Contribution History</h3>
        
        <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 sm:p-6 mb-10">
          {contributions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center text-neutral-300 mb-4">
                <PiggyBank className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">No contributions yet</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">Start saving towards {goal.name}!</p>
              {!isArchived && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-pink-600 font-medium hover:text-pink-700"
                >
                  Add contribution
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedKontribusi).map(([month, monthKontribusi]: [string, any]) => {
                const monthName = new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                return (
                  <div key={month}>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      {monthName}
                    </h4>
                    <div className="divide-y divide-neutral-50">
                      {monthKontribusi.map((contribution: any) => (
                        <ContributionRow 
                          key={contribution.id} 
                          contribution={contribution}
                          currencyCode={couple.currency_code}
                          canDelete={contribution.is_mine && !isArchived && !isSelesai}
                          onDelete={(c) => setContributionToDelete(c)}
                          onEdit={(!isArchived && !isSelesai && contribution.is_mine) ? ((c) => {
                            setContributionToEdit(c)
                            setIsAddModalOpen(true)
                          }) : undefined}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <AddGoalContributionModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setContributionToEdit(null)
        }}
        goal={{...goal, summary}}
        currencyCode={couple.currency_code}
        userName={user.display_name}
        userAvatar={user.avatar_url}
        contributionToEdit={contributionToEdit}
      />

      <ConfirmDeleteModal 
        isOpen={!!contributionToDelete}
        onClose={() => setContributionToDelete(null)}
        onConfirm={handleDeleteContribution}
        title="Delete Contribution"
        description="Are you sure you want to delete this contribution? If this completed the goal, the goal will become active again."
      />

      <ConfirmDeleteModal 
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleArchiveGoal}
        title="Archive Goal"
        description="Are you sure you want to archive this goal? You won't be able to add new contributions to it."
      />

    </AppShell>
  )
}


