import React from 'react'
import { MoreVertical, Edit2, Trash2, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistRowProps {
  item: any
  couple: any
  onToggle: (item: any) => void
  onEdit: (item: any) => void
  onDelete: (item: any) => void
}

export function ChecklistRow({ item, couple, onToggle, onEdit, onDelete }: ChecklistRowProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const isDone = item.status === 'done'

  // Assignee logic
  let badgeColor = "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800"
  if (item.assigned_to === 'partner_a') {
    badgeColor = "bg-pink-100 text-pink-700 border-pink-200"
  } else if (item.assigned_to === 'partner_b') {
    badgeColor = "bg-rose-100 text-rose-700 border-rose-200"
  }

  const toggleStatus = () => {
    onToggle({ ...item, status: isDone ? 'todo' : 'done' })
  }

  return (
    <div className={cn(
      "group relative flex items-start space-x-3 p-3 rounded-xl transition-all duration-300",
      isDone ? "bg-neutral-50 dark:bg-neutral-900/50" : "hover:bg-pink-50/50"
    )}>
      {/* Custom Checkbox */}
      <button
        type="button"
        onClick={toggleStatus}
        className={cn(
          "w-5 h-5 rounded-md border-2 mt-0.5 flex items-center justify-center transition-colors shrink-0",
          isDone ? "bg-pink-500 border-pink-500" : "border-neutral-300 group-hover:border-pink-400 bg-white dark:bg-neutral-950"
        )}
      >
        <svg 
          className={cn("w-3.5 h-3.5 text-white transition-transform duration-300 ease-out", isDone ? "scale-100" : "scale-0")} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-start justify-between gap-2">
          <button 
            onClick={toggleStatus}
            className={cn(
              "text-left font-medium text-[15px] leading-tight mb-1 truncate flex-1 transition-all duration-300",
              isDone ? "text-neutral-400 line-through" : "text-neutral-800"
            )}
          >
            {item.title}
          </button>
          
          {/* Assigned Badge */}
          <div className={cn("px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0", badgeColor, isDone && "opacity-50 grayscale")}>
            {item.assigned_to_label}
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs mt-1">
          {/* Due Date logic */}
          {item.due_date && !isDone && (
            <div className={cn(
              "flex items-center space-x-1",
              item.is_terlewat ? "text-rose-600 font-medium" : "text-neutral-500 dark:text-neutral-400"
            )}>
              {item.is_terlewat ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span>{item.due_date_formatted}</span>
            </div>
          )}
          
          {isDone && item.completed_by && (
            <div className="text-neutral-400 italic">
              Selesai by {item.completed_by.display_name}
            </div>
          )}
        </div>
      </div>

      {/* Kebab Menu */}
      <div className="absolute top-2 right-2">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-white dark:bg-neutral-950 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-neutral-950 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-800 py-1 z-20 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => { setShowMenu(false); onEdit(item); }}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 flex items-center"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                </button>
                {item.can_delete && (
                  <button
                    onClick={() => { setShowMenu(false); onDelete(item); }}
                    className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

