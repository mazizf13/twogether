import React, { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { X, Calendar } from 'lucide-react'
import { AmountInput } from '@/components/molecules/AmountInput'
import { SplitSlider } from '@/components/molecules/SplitSlider'
import { CategoryIcon } from '@/components/atoms/CategoryIcon'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface EditSharedExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  expense: any | null
  categories: Record<string, string>
  currencyCode: string
  partnerA: { id: number, name: string }
  partnerB: { id: number, name: string }
  currentUserId: number
}

export function EditSharedExpenseModal({ 
  isOpen, 
  onClose,
  expense,
  categories, 
  currencyCode,
  partnerA,
  partnerB,
  currentUserId
}: EditSharedExpenseModalProps) {
  
  const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
    amount_cents: 0,
    category: '',
    description: '',
    expense_date: '',
    paid_by_id: currentUserId,
    partner_a_split_pct: 50,
    partner_b_split_pct: 50,
    shared_expense_group_id: '',
  })

  useEffect(() => {
    if (isOpen && expense) {
      setData({
        amount_cents: expense.amount_cents,
        category: expense.category,
        description: expense.description || '',
        expense_date: expense.expense_date,
        paid_by_id: expense.paid_by_id,
        partner_a_split_pct: expense.partner_a_split_pct,
        partner_b_split_pct: expense.partner_b_split_pct,
        shared_expense_group_id: expense.shared_expense_group_id,
      })
      clearErrors()
    }
  }, [isOpen, expense])

  if (!isOpen || !expense) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('expenses.shared.update', expense.id), {
      preserveScroll: true,
      onSuccess: () => {
        onClose()
      },
    })
  }

  const handleSplitChange = (partnerASplit: number) => {
    setData(prev => ({
      ...prev,
      partner_a_split_pct: partnerASplit,
      partner_b_split_pct: 100 - partnerASplit
    }))
  }

  const partnerAShare = Math.round(data.amount_cents * (data.partner_a_split_pct / 100))
  const partnerBShare = data.amount_cents - partnerAShare

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-950 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Edit Shared Expense</h2>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          <AmountInput 
            value={data.amount_cents}
            onChange={(val) => setData('amount_cents', val)}
            currencyCode={currencyCode}
            error={errors.amount_cents}
          />

          <div className="space-y-4">
            <div className="hidden">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Siapa yang membayar?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setData('paid_by_id', partnerA.id)}
                  className={cn(
                    "py-2.5 px-4 rounded-xl border font-medium transition-colors",
                    data.paid_by_id === partnerA.id
                      ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900"
                  )}
                >
                  {partnerA.id === currentUserId ? 'You' : partnerA.name}
                </button>
                <button
                  type="button"
                  onClick={() => setData('paid_by_id', partnerB.id)}
                  className={cn(
                    "py-2.5 px-4 rounded-xl border font-medium transition-colors",
                    data.paid_by_id === partnerB.id
                      ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900"
                  )}
                >
                  {partnerB.id === currentUserId ? 'You' : partnerB.name}
                </button>
              </div>
              {errors.paid_by_id && <p className="mt-1 text-xs text-rose-500">{errors.paid_by_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Kategori</label>
              <div className="relative">
                <Select value={data.category} onValueChange={(val) => setData('category', val)}>
                  <SelectTrigger className="w-full pl-10">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none z-10">
                  <CategoryIcon category={data.category} size="sm" />
                </div>
              </div>
              {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="edit_description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Deskripsi (Opsional)</label>
              <input
                id="edit_description"
                type="text"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder="What was this for?"
                className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
              />
              {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Siapa yang Membayar? (Payer)</label>
              <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl space-x-1">
                <button
                  type="button"
                  onClick={() => setData('paid_by_id', partnerA.id)}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                    data.paid_by_id === partnerA.id 
                      ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 shadow-sm" 
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200"
                  )}
                >
                  {partnerA.id === currentUserId ? 'You' : partnerA.name}
                </button>
                <button
                  type="button"
                  onClick={() => setData('paid_by_id', partnerB.id)}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                    data.paid_by_id === partnerB.id 
                      ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 shadow-sm" 
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200"
                  )}
                >
                  {partnerB.id === currentUserId ? 'You' : partnerB.name}
                </button>
              </div>
              {errors.paid_by_id && <p className="mt-1 text-xs text-rose-500">{errors.paid_by_id}</p>}
            </div>

            <div>
              <label htmlFor="edit_expense_date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Tanggal</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="edit_expense_date"
                  type="date"
                  value={data.expense_date}
                  onChange={e => setData('expense_date', e.target.value)}
                  className="w-full pl-10 rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              {errors.expense_date && <p className="mt-1 text-xs text-rose-500">{errors.expense_date}</p>}
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-4">Proporsi Beban Tagihan (Split)</label>
              <SplitSlider 
                partnerAName={partnerA.id === currentUserId ? 'You' : partnerA.name}
                partnerBName={partnerB.id === currentUserId ? 'You' : partnerB.name}
                partnerASplit={data.partner_a_split_pct}
                onChange={handleSplitChange}
                isPartnerACurrentUser={partnerA.id === currentUserId}
                error={errors.partner_a_split_pct || errors.partner_b_split_pct}
              />
              
              {data.amount_cents > 0 && (
                <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl text-sm flex justify-between items-center text-neutral-600 dark:text-neutral-300">
                  <div className="flex flex-col">
                    <span>{partnerA.id === currentUserId ? 'Tanggunganmu' : `Tanggungan ${partnerA.name}`}:</span>
                    <CurrencyAmount cents={partnerAShare} currencyCode={currencyCode} className="font-semibold text-neutral-900 dark:text-neutral-100" />
                  </div>
                  <div className="w-px h-8 bg-neutral-200 mx-4" />
                  <div className="flex flex-col items-end">
                    <span>{partnerB.id === currentUserId ? 'Tanggunganmu' : `Tanggungan ${partnerB.name}`}:</span>
                    <CurrencyAmount cents={partnerBShare} currencyCode={currencyCode} className="font-semibold text-neutral-900 dark:text-neutral-100" />
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-center text-neutral-400 mt-4">
              Changes to this expense will be recorded in the audit trail.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-xl font-medium hover:bg-neutral-50 dark:bg-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing || data.amount_cents <= 0}
              className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-pink-sm"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


