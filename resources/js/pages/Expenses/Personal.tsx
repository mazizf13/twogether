import React, { useState } from 'react'
import { Head, usePage, router, Link } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { Plus, Filter, Wallet } from 'lucide-react'
import { ExpenseRow } from '@/components/molecules/ExpenseRow'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'
import { CategoryIcon } from '@/components/atoms/CategoryIcon'
import { AddPersonalExpenseModal } from '@/components/modals/AddPersonalExpenseModal'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { EmptyState } from '@/components/molecules/EmptyState'
import { IllustrationNoExpenses } from '@/components/atoms/illustrations/IllustrationNoExpenses'

export default function PersonalExpenses({
  expenses,
  summary,
  filters,
  active_filters,
  currency_code
}: any) {
  const { auth } = usePage().props as any
  const user = auth.user
  const couple = auth.couple

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [expenseToEdit, setExpenseToEdit] = useState<any | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<any | null>(null)

  const handleFilterChange = (key: string, value: string) => {
    router.get(route('expenses.personal'), {
      ...active_filters,
      [key]: value === active_filters[key] ? null : value
    }, { preserveState: true })
  }

  const handleDelete = () => {
    if (!expenseToDelete) return
    router.delete(route('expenses.personal.destroy', expenseToDelete.id), {
      preserveScroll: true,
      onSuccess: () => setExpenseToDelete(null),
    })
  }

  // Group expenses by month
  const groupedExpenses = expenses.data.reduce((acc: any, expense: any) => {
    const month = expense.expense_date.substring(0, 7) // YYYY-MM
    if (!acc[month]) acc[month] = []
    acc[month].push(expense)
    return acc
  }, {})

  return (
    <AppShell title="Pengeluaran Pribadi" coupleName={couple.name} userName={user.display_name} userAvatar={user.avatar_url}>
      
      {/* Header Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6 space-x-6 overflow-x-auto">
        <div className="pb-3 text-sm font-medium text-pink-600 border-b-2 border-pink-500 whitespace-nowrap">
          Pengeluaran Pribadi
        </div>
        <Link href={route('income.personal')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Pemasukan Pribadi
        </Link>
        <Link href={route('expenses.shared')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Shared
        </Link>
        <Link href={route('expenses.balance')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
          Balance
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Pengeluaranku</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Catat pengeluaran pribadimu.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-center">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Total Pribadi</span>
          <CurrencyAmount cents={summary.total_cents} currencyCode={currency_code} size="display" />
        </div>
        
        <div className="md:col-span-2 bg-white dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4">Kategori Utama</h3>
          <div className="flex space-x-6 overflow-x-auto pb-2">
            {summary.by_category.slice(0, 4).map((cat: any) => (
              <div key={cat.category} className="flex items-center space-x-3 shrink-0">
                <CategoryIcon category={cat.category} size="md" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {filters.categories[cat.category] || cat.category}
                  </span>
                  <CurrencyAmount cents={cat.total_cents} currencyCode={currency_code} className="text-neutral-500 dark:text-neutral-400 text-xs" />
                </div>
              </div>
            ))}
            {summary.by_category.length === 0 && (
              <p className="text-sm text-neutral-400 italic">Belum ada kategori.</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-400 mr-2 shrink-0">
          <Filter className="w-4 h-4 mr-1.5" />
          Saring:
        </div>
        
        {Object.entries(filters.categories).slice(0, 6).map(([key, label]: [string, any]) => (
          <button
            key={key}
            onClick={() => handleFilterChange('category', key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              active_filters.category === key 
                ? 'bg-neutral-800 text-white' 
                : 'bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 sm:p-6 mb-10">
        {expenses.data.length === 0 ? (
          <EmptyState 
            illustration={<IllustrationNoExpenses />}
            title="Belum ada pengeluaran"
            description="Mulai catat pengeluaranmu untuk melihat ke mana uangmu pergi."
            action={{ label: 'Add Expense', onClick: () => setIsAddModalOpen(true) }}
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedExpenses).map(([month, monthExpenses]: [string, any]) => {
              const monthName = new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              return (
                <div key={month}>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    {monthName}
                  </h4>
                  <div className="divide-y divide-neutral-50">
                    {monthExpenses.map((expense: any) => (
                      <ExpenseRow 
                        key={expense.id}
                        expense={expense}
                        type="personal"
                        currencyCode={currency_code}
                        onEdit={(e) => { setExpenseToEdit(e); setIsAddModalOpen(true); }}
                        onDelete={(e) => setExpenseToDelete(e)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AddPersonalExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setExpenseToEdit(null); }} 
        categories={filters.categories}
        currencyCode={currency_code}
        expenseToEdit={expenseToEdit}
      />

      <ConfirmDeleteModal 
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Pengeluaran"
        description="Yakin ingin menghapus pengeluaran pribadi ini? Tindakan ini tidak bisa dibatalkan."
      />
    </AppShell>
  )
}



