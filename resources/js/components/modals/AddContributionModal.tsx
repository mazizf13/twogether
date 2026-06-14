import React, { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { X, Calendar } from 'lucide-react'
import { AmountInput } from '@/components/molecules/AmountInput'
import { cn } from '@/lib/utils'

interface AddContributionModalProps {
  isOpen: boolean
  onClose: () => void
  currencyCode: string
  userName: string
  userAvatar: string | null
  currentProgressPct: number
  targetCents: number | null
  contributionToEdit?: any | null
}

export function AddContributionModal({ 
  isOpen, 
  onClose, 
  currencyCode, 
  userName, 
  userAvatar,
  currentProgressPct,
  targetCents,
  contributionToEdit
}: AddContributionModalProps) {
  
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    amount_cents: 0,
    contribution_date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    if (isOpen) {
      if (contributionToEdit) {
        setData({
          amount_cents: contributionToEdit.amount_cents,
          contribution_date: contributionToEdit.contribution_date,
          notes: contributionToEdit.notes || '',
        })
      } else {
        reset()
      }
      clearErrors()
    }
  }, [isOpen, contributionToEdit])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const options = {
      preserveScroll: true,
      onSuccess: () => {
        onClose()
      },
    }

    if (contributionToEdit) {
      put(route('savings.contributions.update', contributionToEdit.id), options)
    } else {
      post(route('savings.contributions.store'), options)
    }
  }

  // Calculate projected progress
  let projectedProgress = currentProgressPct
  if (targetCents && targetCents > 0) {
    const projectedCents = (currentProgressPct / 100 * targetCents) + data.amount_cents
    projectedProgress = Math.min(100, (projectedCents / targetCents) * 100)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-950 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {contributionToEdit ? 'Ubah Kontribusi' : 'Tambah Tabungan Pernikahan'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          <div className="flex items-center space-x-3 bg-neutral-50 dark:bg-neutral-900 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm">
                {userName.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Saving as {userName}</span>
          </div>

          <AmountInput 
            value={data.amount_cents}
            onChange={(val) => setData('amount_cents', val)}
            currencyCode={currencyCode}
            error={errors.amount_cents}
          />

          {targetCents && targetCents > 0 && data.amount_cents > 0 && (
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-pink-700 font-medium">After this contribution:</span>
                <span className="text-pink-700 font-bold">{projectedProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-pink-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500 transition-all duration-500"
                  style={{ width: `${projectedProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="contribution_date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Tanggal</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="contribution_date"
                  type="date"
                  value={data.contribution_date}
                  onChange={e => setData('contribution_date', e.target.value)}
                  className="w-full pl-10 rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              {errors.contribution_date && <p className="mt-1 text-xs text-rose-500">{errors.contribution_date}</p>}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Notes (Optional)</label>
              <input
                id="notes"
                type="text"
                value={data.notes}
                onChange={e => setData('notes', e.target.value)}
                placeholder="e.g. Bonus from work 💪"
                className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
              />
              {errors.notes && <p className="mt-1 text-xs text-rose-500">{errors.notes}</p>}
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
              {processing ? 'Saving...' : (contributionToEdit ? 'Simpan Perubahan' : 'Add Contribution')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


