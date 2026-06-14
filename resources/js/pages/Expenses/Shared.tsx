import React, { useState } from 'react'
import { Head, usePage, router, Link } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { Plus, FolderOpen } from 'lucide-react'
import { BalanceBadge } from '@/components/molecules/BalanceBadge'
import { EmptyState } from '@/components/molecules/EmptyState'
import { IllustrationNoExpenses } from '@/components/atoms/illustrations/IllustrationNoExpenses'
import { AddSharedExpenseGroupModal } from '@/components/modals/AddSharedExpenseGroupModal'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default function SharedExpenses({
  groups,
  balance,
  couple,
}: any) {
  const { auth } = usePage().props as any
  const user = auth.user

  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false)

  return (
    <AppShell title="Pengeluaran Bersama" coupleName={couple.name} userName={user.display_name} userAvatar={user.avatar_url}>
      
      {/* Header Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6 space-x-6 overflow-x-auto">
        <Link href={route('expenses.personal')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Pengeluaran Pribadi
        </Link>
        <Link href={route('income.personal')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Pemasukan Pribadi
        </Link>
        <div className="pb-3 text-sm font-medium text-pink-600 border-b-2 border-pink-500 whitespace-nowrap">
          Shared
        </div>
        <Link href={route('expenses.balance')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Balance
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Shared Expenses</h1>
            <BalanceBadge 
              netCents={balance.net_cents}
              owedByName={balance.owed_by_name}
              owedToName={balance.owed_to_name}
              isSettled={balance.is_settled}
              currencyCode={couple.currency_code}
            />
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Bagi biaya dan catat pengeluaran bersama per kegiatan.</p>
        </div>
        <button 
          onClick={() => setIsAddGroupModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event / Kegiatan
        </button>
      </div>

      {/* Groups List */}
      <div className="mb-10">
        {groups.data.length === 0 ? (
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 sm:p-6">
            <EmptyState 
              illustration={<IllustrationNoExpenses />}
              title="Belum ada kegiatan"
              description="Buat kegiatan pertamamu (misal: Traveling, Kencan) untuk mulai mencatat pengeluaran bersama."
              action={{ label: 'Add Event', onClick: () => setIsAddGroupModalOpen(true) }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.data.map((group: any) => (
              <Link 
                key={group.id} 
                href={route('expenses.shared.groups.show', group.id)}
                className="group relative bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md hover:border-pink-300 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${group.color === 'neutral' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400' : 'bg-pink-100 text-pink-600'} group-hover:scale-105 transition-transform`}>
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  {group.status === 'settled' && (
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Settled</span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-pink-600 transition-colors line-clamp-1">{group.name}</h3>
                {group.description && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 flex-1">{group.description}</p>
                )}
                
                <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span>{group.shared_expenses_count || 0} Pengeluaran</span>
                  <span>{formatDistanceToNow(new Date(group.updated_at), { addSuffix: true, locale: id })}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <AddSharedExpenseGroupModal 
        isOpen={isAddGroupModalOpen} 
        onClose={() => setIsAddGroupModalOpen(false)} 
      />

    </AppShell>
  )
}
