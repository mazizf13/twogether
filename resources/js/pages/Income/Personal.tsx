import React, { useState } from 'react'
import { Head, usePage, router, Link } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { Plus, ArrowUpRight, ArrowDownRight, Briefcase, Laptop, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PersonalIncome } from '@/types'
import { IncomeRow } from '@/components/molecules/IncomeRow'
import { AddIncomeModal } from '@/components/modals/AddIncomeModal'
import { cn } from '@/lib/utils'

interface PersonalIncomeProps {
  incomes: {
    data: PersonalIncome[]
    links: any[]
  }
  recurring_incomes: PersonalIncome[]
  summary: {
    total_this_month_cents: number
    total_last_month_cents: number
    change_pct: number
    by_source: any[]
  }
  filters: {
    sources: Record<string, string>
  }
  active_filters: {
    source: string | null
    month: string | null
  }
  currency_code: string
}

export default function PersonalIncomePage({
  incomes,
  recurring_incomes,
  summary,
  filters,
  active_filters,
  currency_code
}: PersonalIncomeProps) {

  const { auth } = usePage().props as any
  const user = auth.user
  const couple = auth.couple

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [incomeToEdit, setIncomeToEdit] = useState<PersonalIncome | null>(null)

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat(currency_code === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency_code,
      minimumFractionDigits: currency_code === 'IDR' ? 0 : 2,
    }).format(cents / 100)
  }

  const handleEdit = (income: PersonalIncome) => {
    setIncomeToEdit(income)
    setIsAddModalOpen(true)
  }

  const handleDelete = (income: PersonalIncome) => {
    if (confirm('Apakah Anda yakin ingin menghapus pemasukan ini?')) {
      router.delete(route('income.personal.destroy', income.id))
    }
  }

  const groupIncomesByMonth = (incomesList: PersonalIncome[]) => {
    const grouped: Record<string, PersonalIncome[]> = {}
    
    incomesList.forEach(income => {
      const date = new Date(income.income_date)
      const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      if (!grouped[monthYear]) {
        grouped[monthYear] = []
      }
      grouped[monthYear].push(income)
    })
    
    return grouped
  }

  const groupedIncomes = groupIncomesByMonth(incomes.data)

  const isBetter = summary.change_pct >= 0

  return (
    <AppShell 
      title="Pemasukan Pribadi" 
      coupleName={couple.name}
      userName={user.display_name}
      userAvatar={user.avatar_url}
    >
      <Head title="Pemasukan Pribadi - Twogether" />

      <div className="flex flex-col space-y-6 md:space-y-8 pb-10">
        
        {/* Header Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-6 overflow-x-auto">
          <Link href={route('expenses.personal')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
            Pengeluaran Pribadi
          </Link>
          <div className="pb-3 text-sm font-medium text-pink-600 border-b-2 border-pink-500 whitespace-nowrap">
            Pemasukan Pribadi
          </div>
          <Link href={route('expenses.shared')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
            Shared
          </Link>
          <Link href={route('expenses.balance')} className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
            Balance
          </Link>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Pemasukan Saya</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Catat pemasukan pribadimu agar kondisi keuanganmu lebih jelas.
            </p>
          </div>
          <Button 
            onClick={() => { setIncomeToEdit(null); setIsAddModalOpen(true); }}
            className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pemasukan
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 flex flex-col">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Total Bulan Ini</span>
            <span className="text-3xl font-bold text-green-600 tracking-tight">
              {formatCurrency(summary.total_this_month_cents)}
            </span>
            <div className="mt-3 flex items-center text-xs font-medium">
              <span className={cn(
                "flex items-center px-2 py-1 rounded-full",
                isBetter ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}>
                {isBetter ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(summary.change_pct)}%
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 ml-2">vs bulan lalu</span>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 flex flex-col md:col-span-2 justify-center">
            {recurring_incomes.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3 flex items-center">
                  <Wallet className="w-4 h-4 mr-1.5" />
                  Pemasukan Rutinmu
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recurring_incomes.map(inc => (
                    <div key={inc.id} className="flex flex-row items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 sm:py-2 sm:px-4 text-sm w-full sm:w-auto">
                      <span className="font-semibold text-blue-900 truncate mr-3">{inc.source_label}</span>
                      <span className="text-blue-700 text-xs sm:text-sm whitespace-nowrap text-right font-medium">
                        {inc.monthly_equivalent_cents ? formatCurrency(inc.monthly_equivalent_cents) + '/bln' : inc.formatted_amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-neutral-500 dark:text-neutral-400 py-2">
                <p className="text-sm">Belum ada pemasukan rutin.</p>
              </div>
            )}
          </div>
        </div>

        {/* Income List */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">Riwayat Pemasukan</h2>
          
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 sm:p-6 min-h-[400px]">
            {incomes.data.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center mb-4 border border-neutral-100 dark:border-neutral-800">
                  <Wallet className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 font-semibold mb-1">Belum ada pemasukan</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
                  Mulai catat pemasukanmu untuk mendapatkan analitik keuangan yang lebih baik.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => { setIncomeToEdit(null); setIsAddModalOpen(true); }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Pemasukan Pertama
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedIncomes).map(([monthYear, monthIncomes]) => (
                  <div key={monthYear}>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 px-2">
                      {monthYear}
                    </h3>
                    <div className="divide-y divide-neutral-50">
                      {monthIncomes.map((income) => (
                        <IncomeRow 
                          key={income.id}
                          income={income}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <AddIncomeModal 
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIncomeToEdit(null); }}
        sources={filters.sources}
        currencyCode={currency_code}
        incomeToEdit={incomeToEdit}
      />
    </AppShell>
  )
}
