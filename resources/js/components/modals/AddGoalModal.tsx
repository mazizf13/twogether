import React, { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { X } from 'lucide-react'
import { AmountInput } from '@/components/molecules/AmountInput'

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  currencyCode: string
}

export function AddGoalModal({ isOpen, onClose, currencyCode }: AddGoalModalProps) {
  
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: '',
    target_amount_cents: 0,
    deadline: '',
    description: '',
    icon: 'default',
  })

  useEffect(() => {
    if (isOpen) {
      reset()
      clearErrors()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('savings.goals.store'), {
      preserveScroll: true,
      onSuccess: () => {
        onClose()
      },
    })
  }

  const suggestions = [
    { name: 'Venue', icon: 'venue' },
    { name: 'Honeymoon', icon: 'honeymoon' },
    { name: 'Rings', icon: 'rings' },
    { name: 'Photography', icon: 'photography' },
    { name: 'Catering', icon: 'catering' },
    { name: 'Attire', icon: 'attire' },
  ]

  const handleSuggestionClick = (suggestion: any) => {
    setData(prev => ({
      ...prev,
      name: suggestion.name,
      icon: suggestion.icon
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-950 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">New Savings Goal</h2>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Goal Name</label>
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              placeholder="e.g. Honeymoon, Venue Deposit..."
              className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map(s => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => handleSuggestionClick(s)}
                  className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 hover:bg-pink-50 text-neutral-600 dark:text-neutral-300 hover:text-pink-600 border border-neutral-100 dark:border-neutral-800 hover:border-pink-200 rounded-full text-xs font-medium transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Target Amount</label>
            <AmountInput 
              value={data.target_amount_cents}
              onChange={(val) => setData('target_amount_cents', val)}
              currencyCode={currencyCode}
              error={errors.target_amount_cents}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Deadline (Optional)</label>
              <input
                id="deadline"
                type="date"
                value={data.deadline}
                onChange={e => setData('deadline', e.target.value)}
                className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
              />
              {errors.deadline && <p className="mt-1 text-xs text-rose-500">{errors.deadline}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Notes (Optional)</label>
              <textarea
                id="description"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                rows={2}
                className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500 resize-none"
              />
              {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
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
              disabled={processing || data.target_amount_cents <= 0 || !data.name}
              className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-pink-sm"
            >
              {processing ? 'Creating...' : 'Buat Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


