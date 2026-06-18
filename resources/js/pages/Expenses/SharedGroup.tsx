import React, { useState } from 'react'
import { Head, usePage, router, Link } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { Plus, Filter, ArrowLeft, FolderOpen } from 'lucide-react'
import { ExpenseRow } from '@/components/molecules/ExpenseRow'
import { AddSharedExpenseModal } from '@/components/modals/AddSharedExpenseModal'
import { EditSharedExpenseModal } from '@/components/modals/EditSharedExpenseModal'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { AddSharedExpenseGroupModal } from '@/components/modals/AddSharedExpenseGroupModal'
import { EmptyState } from '@/components/molecules/EmptyState'
import { IllustrationNoExpenses } from '@/components/atoms/illustrations/IllustrationNoExpenses'

export default function SharedGroup({
  group,
  expenses,
  couple,
  filters,
}: any) {
  const { auth } = usePage().props as any
  const user = auth.user

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [expenseToEdit, setExpenseToEdit] = useState<any | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<any | null>(null)
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false)
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false)

  const handleDeleteExpense = () => {
    if (!expenseToDelete) return
    router.delete(route('expenses.shared.destroy', expenseToDelete.id), {
      preserveScroll: true,
      onSuccess: () => setExpenseToDelete(null),
    })
  }

  const handleDeleteGroup = () => {
    router.delete(route('expenses.shared.groups.destroy', group.id))
  }

  // Group expenses by month
  const groupedExpenses = expenses.data.reduce((acc: any, expense: any) => {
    const month = expense.expense_date.substring(0, 7)
    if (!acc[month]) acc[month] = []
    acc[month].push(expense)
    return acc
  }, {})

  return (
    <AppShell title={group.name} coupleName={couple.name} userName={user.display_name} userAvatar={user.avatar_url}>
      
      {/* Back Navigation */}
      <Link href={route('expenses.shared')} className="inline-flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Daftar Kegiatan
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center mt-1 ${group.color === 'neutral' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400' : 'bg-pink-100 text-pink-600'}`}>
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{group.name}</h1>
              {group.status === 'settled' && (
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Selesai</span>
              )}
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{group.description || 'Tidak ada deskripsi'}</p>
            <div className="flex space-x-3 mt-2">
              {group.status === 'active' && (
                <>
                  <button 
                    onClick={() => router.post(route('expenses.shared.groups.settle', group.id), {}, { preserveScroll: true })}
                    className="text-xs font-medium text-green-600 hover:text-green-800"
                  >
                    Tandai Selesai
                  </button>
                  <span className="text-neutral-300">|</span>
                </>
              )}
              <button 
                onClick={() => setIsEditGroupModalOpen(true)}
                className="text-xs font-medium text-blue-500 hover:text-blue-700"
              >
                Edit Kegiatan
              </button>
              <span className="text-neutral-300">|</span>
              <button 
                onClick={() => setIsDeleteGroupModalOpen(true)}
                className="text-xs font-medium text-red-500 hover:text-red-700"
              >
                Hapus Kegiatan
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Expenses List */}
      <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 sm:p-6 mb-10">
        {expenses.data.length === 0 ? (
          <EmptyState 
            illustration={<IllustrationNoExpenses />}
            title="Belum ada pengeluaran"
            description={`Tambahkan pengeluaran pertamamu untuk kegiatan ${group.name}.`}
            action={{ label: 'Add Expense', onClick: () => setIsAddModalOpen(true) }}
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedExpenses).map(([month, monthExpenses]: [string, any]) => {
              const monthName = new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              return (
                <div key={month}>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2 flex justify-between items-center">
                    <span>{monthName}</span>
                    <span className="font-normal text-[10px] text-neutral-400">Total: {monthExpenses.length} items</span>
                  </h4>
                  <div className="divide-y divide-neutral-50">
                    {monthExpenses.map((expense: any) => (
                      <ExpenseRow 
                        key={expense.id}
                        expense={expense}
                        type="shared"
                        currencyCode={couple.currency_code}
                        onEdit={(e) => setExpenseToEdit(e)}
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

      <AddSharedExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        categories={filters.categories}
        currencyCode={couple.currency_code}
        partnerA={{ id: couple.partner_a.id, name: couple.partner_a.display_name }}
        partnerB={{ id: couple.partner_b.id, name: couple.partner_b.display_name }}
        currentUserId={user.id}
        groupId={group.id}
      />

      {expenseToEdit && (
        <EditSharedExpenseModal 
          isOpen={!!expenseToEdit} 
          onClose={() => setExpenseToEdit(null)} 
          expense={expenseToEdit}
          categories={filters.categories}
          currencyCode={couple.currency_code}
          partnerA={{ id: couple.partner_a.id, name: couple.partner_a.display_name }}
          partnerB={{ id: couple.partner_b.id, name: couple.partner_b.display_name }}
          currentUserId={user.id}
        />
      )}

      <ConfirmDeleteModal 
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteExpense}
        title="Hapus Pengeluaran Bersama"
        description={`Yakin ingin menghapus pengeluaran ini? Saldo bersama akan dihitung ulang.`}
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteGroupModalOpen}
        onClose={() => setIsDeleteGroupModalOpen(false)}
        onConfirm={handleDeleteGroup}
        title="Hapus Kegiatan"
        description="Yakin ingin menghapus kegiatan ini beserta semua pengeluaran di dalamnya? Saldo bersama akan ikut dihitung ulang dan tindakan ini tidak bisa dibatalkan."
      />

      <AddSharedExpenseGroupModal 
        isOpen={isEditGroupModalOpen}
        onClose={() => setIsEditGroupModalOpen(false)}
        groupToEdit={group}
      />
    </AppShell>
  )
}
