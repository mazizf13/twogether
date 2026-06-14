import React from 'react'
import { CategoryIcon } from '@/components/atoms/CategoryIcon'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'
import { Eye, Edit2, Trash2, MoreVertical } from 'lucide-react'

interface ExpenseRowProps {
  expense: any
  type: 'personal' | 'shared'
  currencyCode: string
  onEdit: (expense: any) => void
  onDelete: (expense: any) => void
}

export function ExpenseRow({ expense, type, currencyCode, onEdit, onDelete }: ExpenseRowProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuRef])

  return (
    <div className="group flex items-center justify-between py-4 px-2 hover:bg-neutral-50 dark:bg-neutral-900/80 transition-colors rounded-xl -mx-2">
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        <CategoryIcon category={expense.category} size="md" />
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {expense.description || (expense.category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()))}
            </span>
            {type === 'personal' && expense.is_visible_to_partner && (
              <div className="flex items-center text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0" title="Visible to partner">
                <Eye className="w-3 h-3 mr-1" />
                Visible
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 space-x-2">
            <span>{expense.expense_date_formatted}</span>
            {type === 'shared' && (
              <>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="truncate">Paid by {expense.paid_by?.display_name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-4 shrink-0">
        <div className="flex flex-col items-end">
          <CurrencyAmount cents={expense.amount_cents} currencyCode={currencyCode} size="md" />
          {type === 'shared' && (
            <span className="text-[10px] font-medium text-neutral-400 mt-0.5">
              {expense.partner_a_split_pct}% / {expense.partner_b_split_pct}% split
            </span>
          )}
        </div>

        {/* Action Menu (Only show for personal if is_mine, always show for shared since policy allows couple edit) */}
        {(type === 'shared' || expense.is_mine) ? (
          <div className="relative shrink-0" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-200/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-neutral-950 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-800 py-1 z-10">
                <button 
                  onClick={() => { setShowMenu(false); onEdit(expense); }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Ubah
                </button>
                <button 
                  onClick={() => { setShowMenu(false); onDelete(expense); }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-9 h-9 shrink-0" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}

