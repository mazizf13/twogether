import React from 'react'
import { PersonalIncome } from '@/types'
import { 
  Briefcase, 
  Laptop, 
  Store, 
  TrendingUp, 
  Home, 
  Gift, 
  Heart, 
  CircleDollarSign,
  MoreVertical,
  Pencil,
  Trash2,
  Lock,
  Repeat
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface IncomeRowProps {
  income: PersonalIncome
  onEdit: (income: PersonalIncome) => void
  onDelete: (income: PersonalIncome) => void
}

export function IncomeRow({ income, onEdit, onDelete }: IncomeRowProps) {
  
  const getIconConfig = (source: string) => {
    switch (source) {
      case 'salary': return { icon: Briefcase, bg: 'bg-green-100', text: 'text-green-600' }
      case 'freelance': return { icon: Laptop, bg: 'bg-blue-100', text: 'text-blue-600' }
      case 'business': return { icon: Store, bg: 'bg-purple-100', text: 'text-purple-600' }
      case 'investment': return { icon: TrendingUp, bg: 'bg-amber-100', text: 'text-amber-600' }
      case 'rental': return { icon: Home, bg: 'bg-orange-100', text: 'text-orange-600' }
      case 'bonus': return { icon: Gift, bg: 'bg-pink-100', text: 'text-pink-600' }
      case 'gift': return { icon: Heart, bg: 'bg-rose-100', text: 'text-rose-600' }
      default: return { icon: CircleDollarSign, bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-600 dark:text-neutral-300' }
    }
  }

  const { icon: Icon, bg, text } = getIconConfig(income.source)

  return (
    <div className="group flex items-center justify-between py-4 px-2 hover:bg-neutral-50 dark:bg-neutral-900/80 transition-colors rounded-xl -mx-2">
      
      {/* Left side: Icon + Details */}
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", bg, text)}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {income.source_label}
            </span>
            {!income.is_visible_to_partner && (
              <Lock className="w-3 h-3 text-neutral-400" title="Hanya kamu yang bisa melihat ini" />
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 space-y-0.5 sm:space-y-0 sm:space-x-2">
            <span>{income.income_date_formatted}</span>
            {income.description && (
              <>
                <span className="hidden sm:inline text-neutral-300">•</span>
                <span className="truncate max-w-[200px]">{income.description}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Amount + Actions */}
      <div className="flex items-center space-x-4 ml-4 shrink-0">
        <div className="flex flex-col items-end">
          {income.is_recurring && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100 mb-1">
              <Repeat className="w-3 h-3 mr-1" />
              {income.recurring_frequency_label}
            </span>
          )}
          <span className="tabular-nums text-base font-semibold text-green-600">
            +{income.formatted_amount}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 dark:text-neutral-300 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(income)} className="cursor-pointer">
              <Pencil className="w-4 h-4 mr-2" />
              <span>Ubah</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(income)}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Hapus</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  )
}
