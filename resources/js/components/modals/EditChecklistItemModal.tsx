import React, { useEffect, useState } from 'react'
import { useForm } from '@inertiajs/react'
import { X, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PartnerAvatar } from '@/components/atoms/PartnerAvatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EditChecklistItemModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
  couple: any
  categories: string[]
}

const PRESET_CATEGORIES = [
  'Planning', 'Venue', 'Catering', 'Attire', 'Photography', 
  'Invitations', 'Music', 'Legal', 'Honeymoon', 'Decorations', 
  'Guests', 'Ceremony', 'Other'
]

export function EditChecklistItemModal({ isOpen, onClose, item, couple, categories }: EditChecklistItemModalProps) {
  const [showNewCategory, setShowNewCategory] = useState(false)

  const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
    title: '',
    category: '',
    new_category: '',
    assigned_to: 'both',
    due_date: '',
    description: '',
    status: 'todo',
  })

  const allCategories = Array.from(new Set([...categories, ...PRESET_CATEGORIES, item?.category]))

  useEffect(() => {
    if (isOpen && item) {
      setData({
        title: item.title,
        category: item.category,
        new_category: '',
        assigned_to: item.assigned_to,
        due_date: item.due_date || '',
        description: item.description || '',
        status: item.status,
      })
      clearErrors()
      setShowNewCategory(false)
    }
  }, [isOpen, item])

  if (!isOpen || !item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const finalCategory = showNewCategory && data.new_category ? data.new_category : data.category

    put(route('wedding.checklist.update', item.id), {
      data: { ...data, category: finalCategory },
      preserveScroll: true,
      onSuccess: () => {
        onClose()
      },
    })
  }

  const PartnerAvatar = ({ partner, isSelected, onClick }: any) => (
    <button 
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200",
        isSelected 
          ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200" 
          : "border-neutral-200 dark:border-neutral-800 hover:border-pink-300 hover:bg-neutral-50 dark:bg-neutral-900"
      )}
    >
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2", isSelected ? "border-pink-500 text-pink-600 bg-white dark:bg-neutral-950" : "border-transparent bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300")}>
        {partner === 'both' ? '👥' : partner.avatar_url ? (
          <img src={partner.avatar_url} className="w-full h-full rounded-full object-cover" />
        ) : (
          partner.display_name.charAt(0)
        )}
      </div>
      <span className={cn("text-xs mt-2 font-medium", isSelected ? "text-pink-700" : "text-neutral-600 dark:text-neutral-300")}>
        {partner === 'both' ? 'Both of Us' : partner.display_name}
      </span>
    </button>
  )

  const isDone = data.status === 'done'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-950 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Edit Task</h2>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Toggle Header */}
          <div className={cn(
            "p-4 rounded-2xl flex items-center justify-between border transition-colors",
            isDone ? "bg-green-50 border-green-200" : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
          )}>
            <div>
              <div className={cn("font-bold", isDone ? "text-green-700" : "text-neutral-700 dark:text-neutral-200")}>
                {isDone ? 'Selesai' : 'To Do'}
              </div>
              {item.status === 'done' && item.completed_by && (
                <div className="text-xs text-green-600 mt-0.5 opacity-80">
                  By {item.completed_by.display_name} on {new Date(item.completed_at).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setData('status', isDone ? 'todo' : 'done')}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                isDone 
                  ? "bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:bg-neutral-800 shadow-sm" 
                  : "bg-green-500 text-white hover:bg-green-600 shadow-sm"
              )}
            >
              {isDone ? 'Mark as To Do' : 'Mark as Done'}
            </button>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Task Name</label>
            <input
              id="title"
              type="text"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Assign To</label>
            <div className="grid grid-cols-3 gap-3">
              <PartnerAvatar 
                partner={couple.partner_a} 
                isSelected={data.assigned_to === 'partner_a'} 
                onClick={() => setData('assigned_to', 'partner_a')} 
              />
              <PartnerAvatar 
                partner={couple.partner_b} 
                isSelected={data.assigned_to === 'partner_b'} 
                onClick={() => setData('assigned_to', 'partner_b')} 
              />
              <PartnerAvatar 
                partner="both" 
                isSelected={data.assigned_to === 'both'} 
                onClick={() => setData('assigned_to', 'both')} 
              />
            </div>
            {errors.assigned_to && <p className="mt-1 text-xs text-rose-500">{errors.assigned_to}</p>}
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <label htmlFor="category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Kategori</label>
              <button 
                type="button" 
                onClick={() => setShowNewCategory(!showNewCategory)}
                className="text-xs text-pink-600 hover:text-pink-700 font-medium"
              >
                {showNewCategory ? 'Select existing' : '+ Add new category'}
              </button>
            </div>
            
            {showNewCategory ? (
              <input
                type="text"
                value={data.new_category}
                onChange={e => setData('new_category', e.target.value)}
                placeholder="Enter custom category name"
                className="w-full rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
                autoFocus
              />
            ) : (
              <Select value={data.category} onValueChange={(val) => setData('category', val)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(cat => (
                    <SelectItem key={cat as string} value={cat as string}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Due Date (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="due_date"
                  type="date"
                  value={data.due_date}
                  onChange={e => setData('due_date', e.target.value)}
                  className="w-full pl-10 rounded-xl border-neutral-200 dark:border-neutral-800 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              {errors.due_date && <p className="mt-1 text-xs text-rose-500">{errors.due_date}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Notes (Optional)</label>
              <textarea
                id="description"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                rows={3}
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
              disabled={processing || !data.title || (showNewCategory && !data.new_category)}
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


