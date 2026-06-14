import React from 'react'
import { useForm } from '@inertiajs/react'
import { X, Eye, EyeOff, Calendar } from 'lucide-react'
import { AmountInput } from '@/components/molecules/AmountInput'
import { CategoryIcon } from '@/components/atoms/CategoryIcon'
import { cn } from '@/lib/utils'

interface AddPersonalExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Record<string, string>
  currencyCode: string
  expenseToEdit?: any | null
}

export function AddPersonalExpenseModal({ isOpen, onClose, categories, currencyCode, expenseToEdit }: AddPersonalExpenseModalProps) {
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    amount_cents: 0,
    category: Object.keys(categories)[0] || '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
    is_visible_to_partner: false,
  })

  // Reset form when modal opens or expenseToEdit changes
  React.useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setData({
          amount_cents: expenseToEdit.amount_cents,
          category: expenseToEdit.category,
          description: expenseToEdit.description || '',
          expense_date: expenseToEdit.expense_date.split('T')[0],
          is_visible_to_partner: expenseToEdit.is_visible_to_partner,
        })
      } else {
        reset()
      }
      clearErrors()
    }
  }, [isOpen, expenseToEdit])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (expenseToEdit) {
      put(route('expenses.personal.update', expenseToEdit.id), {
        preserveScroll: true,
        onSuccess: () => onClose(),
      })
    } else {
      post(route('expenses.personal.store'), {
        preserveScroll: true,
        onSuccess: () => onClose(),
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-950 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {expenseToEdit ? 'Ubah Pengeluaran Pribadi' : 'Tambah Pengeluaran Pribadi'}
          </h2>
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
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Kategori</label>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(categories).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setData('category', key)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl border transition-all",
                      data.category === key 
                        ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm" 
                        : "border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 hover:border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:bg-neutral-900"
                    )}
                  >
                    <CategoryIcon category={key} size="sm" className="mb-1" />
                    <span className="text-[10px] font-medium text-center leading-tight truncate w-full px-1">{label}</span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Description (Optional)</label>
              <input
                id="description"
                type="text"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder="What was this for?"
                className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
              />
              {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="expense_date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Tanggal</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="expense_date"
                  type="date"
                  value={data.expense_date}
                  onChange={e => setData('expense_date', e.target.value)}
                  className="w-full pl-10 rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              {errors.expense_date && <p className="mt-1 text-xs text-rose-500">{errors.expense_date}</p>}
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-start justify-between">
                <div className="pr-4">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
                    Share with partner
                    {data.is_visible_to_partner ? (
                      <Eye className="w-4 h-4 ml-2 text-pink-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 ml-2 text-neutral-400" />
                    )}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    If enabled, your partner will see this expense in their feed, but it won't affect your shared balance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setData('is_visible_to_partner', !data.is_visible_to_partner)}
                  className={cn(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
                    data.is_visible_to_partner ? "bg-pink-500" : "bg-neutral-200"
                  )}
                  role="switch"
                  aria-checked={data.is_visible_to_partner}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-neutral-950 shadow ring-0 transition duration-200 ease-in-out",
                      data.is_visible_to_partner ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
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
              {processing ? 'Menyimpan...' : (expenseToEdit ? 'Simpan Perubahan' : 'Tambah Pengeluaran')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


