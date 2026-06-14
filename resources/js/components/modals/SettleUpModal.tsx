import React, { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { X, Calendar, CheckCircle2 } from 'lucide-react'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'
import { cn } from '@/lib/utils'

interface SettleUpModalProps {
  isOpen: boolean
  onClose: () => void
  balance: {
    net_cents: number
    owed_by_name: string | null
    owed_to_name: string | null
    is_settled: boolean
  }
  currencyCode: string
}

export function SettleUpModal({ isOpen, onClose, balance, currencyCode }: SettleUpModalProps) {
  
  const amountToSettle = Math.abs(balance.net_cents)
  
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    amount_cents: amountToSettle,
    settlement_date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    if (isOpen) {
      reset()
      setData('amount_cents', amountToSettle)
      clearErrors()
    }
  }, [isOpen, amountToSettle])

  if (!isOpen) return null

  if (balance.is_settled) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white dark:bg-neutral-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">You're all settled up!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">There is no outstanding balance between you two.</p>
          <button 
            onClick={onClose}
            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('expenses.balance.settle'), {
      preserveScroll: true,
      onSuccess: () => {
        onClose()
      },
    })
  }

  const viewerOwes = balance.net_cents < 0
  const payerName = viewerOwes ? 'You' : balance.owed_by_name
  const payeeName = viewerOwes ? balance.owed_to_name : 'You'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-950 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Lunasi</h2>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          <div className="text-center p-6 bg-pink-50 rounded-2xl border border-pink-100">
            <p className="text-sm text-pink-600 font-medium mb-1">
              {payerName} paying {payeeName}
            </p>
            <CurrencyAmount 
              cents={data.amount_cents} 
              currencyCode={currencyCode} 
              size="display" 
              className="text-pink-700" 
            />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="settlement_date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Date Paid</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="settlement_date"
                  type="date"
                  value={data.settlement_date}
                  onChange={e => setData('settlement_date', e.target.value)}
                  className="w-full pl-10 rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              {errors.settlement_date && <p className="mt-1 text-xs text-rose-500">{errors.settlement_date}</p>}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Notes (Optional)</label>
              <input
                id="notes"
                type="text"
                value={data.notes}
                onChange={e => setData('notes', e.target.value)}
                placeholder="e.g. Bank transfer"
                className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
              />
              {errors.notes && <p className="mt-1 text-xs text-rose-500">{errors.notes}</p>}
            </div>
            
            <input type="hidden" value={data.amount_cents} name="amount_cents" />
            {errors.amount_cents && <p className="mt-1 text-xs text-rose-500">{errors.amount_cents}</p>}
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
              disabled={processing}
              className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-pink-sm"
            >
              {processing ? 'Confirming...' : 'Confirm Settlement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


