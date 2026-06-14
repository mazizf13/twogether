import React from 'react'
import { Trash2, MoreVertical, Pencil } from 'lucide-react'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface ContributionRowProps {
  contribution: any
  currencyCode: string
  canDelete: boolean // rename to canEditOrDelete for accuracy? We'll leave it as canDelete but meaning both
  onDelete: (contribution: any) => void
  onEdit?: (contribution: any) => void
}

export function ContributionRow({ contribution, currencyCode, canDelete, onDelete, onEdit }: ContributionRowProps) {
  return (
    <div className="group flex items-center justify-between py-4 px-2 hover:bg-neutral-50 dark:bg-neutral-900/80 transition-colors rounded-xl -mx-2">
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        
        {contribution.user?.avatar_url ? (
          <img 
            src={contribution.user.avatar_url} 
            alt={contribution.user.display_name} 
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200 dark:border-neutral-800"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold shrink-0">
            {contribution.user?.display_name?.charAt(0) || '?'}
          </div>
        )}
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {contribution.is_mine ? 'You' : contribution.user?.display_name}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 space-y-0.5 sm:space-y-0 sm:space-x-2">
            <span>{contribution.contribution_date_formatted}</span>
            {contribution.notes && (
              <>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-neutral-300" />
                <span className="truncate italic">"{contribution.notes}"</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-4 shrink-0">
        <div className="flex flex-col items-end">
          <CurrencyAmount cents={contribution.amount_cents} currencyCode={currencyCode} size="md" className="font-semibold text-neutral-900 dark:text-neutral-100" />
        </div>

        {canDelete ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 dark:text-neutral-300 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(contribution)} className="cursor-pointer">
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Ubah</span>
                </DropdownMenuItem>
              )}
              {onEdit && <DropdownMenuSeparator />}
              <DropdownMenuItem 
                onClick={() => onDelete(contribution)}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="w-8 h-8 shrink-0" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}

