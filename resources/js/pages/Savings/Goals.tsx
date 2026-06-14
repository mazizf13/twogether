import React, { useState } from 'react'
import { Head, usePage, router, Link } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { Plus, Target } from 'lucide-react'
import { GoalCard } from '@/components/molecules/GoalCard'
import { AddGoalModal } from '@/components/modals/AddGoalModal'
import { AddGoalContributionModal } from '@/components/modals/AddGoalContributionModal'
import { EmptyState } from '@/components/molecules/EmptyState'
import { IllustrationNoGoals } from '@/components/atoms/illustrations/IllustrationNoGoals'

export default function Goals({
  goals,
  couple,
}: any) {
  const { auth } = usePage().props as any
  const user = auth.user

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
  const [goalToContributeTo, setGoalToContributeTo] = useState<any | null>(null)

  const activeGoals = goals.filter((g: any) => g.status === 'active')
  const completedGoals = goals.filter((g: any) => g.status === 'completed')
  const archivedGoals = goals.filter((g: any) => g.status === 'archived')

  return (
    <AppShell title="Target Tabungan" coupleName={couple.name} userName={user.display_name} userAvatar={user.avatar_url}>
      
      {/* Header Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6 space-x-6 overflow-x-auto">
        <Link href={route('savings.index')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Overview
        </Link>
        <div className="pb-3 text-sm font-medium text-pink-600 border-b-2 border-pink-500 whitespace-nowrap">
          Goals
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Target Tabungan</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Break down your savings into specific targets.</p>
        </div>
        <button 
          onClick={() => setIsAddGoalModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState 
          illustration={<IllustrationNoGoals />}
          title="No goals yet"
          description="Break your savings into specific goals — venue, honeymoon, rings..."
          action={{ label: 'Buat Target', onClick: () => setIsAddGoalModalOpen(true) }}
        />
      ) : (
        <div className="space-y-12">
          
          {activeGoals.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGoals.map((goal: any) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    currencyCode={couple.currency_code} 
                    onContribute={(g) => setGoalToContributeTo(g)}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Selesai
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedGoals.map((goal: any) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    currencyCode={couple.currency_code} 
                    onContribute={() => {}}
                  />
                ))}
              </div>
            </div>
          )}

          {archivedGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                Archived
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                {archivedGoals.map((goal: any) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    currencyCode={couple.currency_code} 
                    onContribute={() => {}}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      <AddGoalModal 
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        currencyCode={couple.currency_code}
      />

      <AddGoalContributionModal 
        isOpen={!!goalToContributeTo}
        onClose={() => setGoalToContributeTo(null)}
        goal={goalToContributeTo}
        currencyCode={couple.currency_code}
        userName={user.display_name}
        userAvatar={user.avatar_url}
      />

    </AppShell>
  )
}


