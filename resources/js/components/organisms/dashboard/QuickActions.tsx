import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import { Plus, CreditCard, PiggyBank, CheckSquare, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile inline actions (shows below hero or bottom of screen, but we'll place it in the grid) */}
      <div className="lg:hidden grid grid-cols-4 gap-2">
        <Link href={route('income.personal')} className="flex flex-col items-center justify-center py-3 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-neutral-600 dark:text-neutral-300 hover:text-pink-600 hover:border-pink-100 transition-colors">
          <CreditCard className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Income</span>
        </Link>
        <Link href={route('expenses.shared')} className="flex flex-col items-center justify-center py-3 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-neutral-600 dark:text-neutral-300 hover:text-pink-600 hover:border-pink-100 transition-colors">
          <CreditCard className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Expense</span>
        </Link>
        <Link href={route('savings.index')} className="flex flex-col items-center justify-center py-3 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-neutral-600 dark:text-neutral-300 hover:text-pink-600 hover:border-pink-100 transition-colors">
          <PiggyBank className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Savings</span>
        </Link>
        <Link href={route('wedding.checklist.index')} className="flex flex-col items-center justify-center py-3 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-neutral-600 dark:text-neutral-300 hover:text-pink-600 hover:border-pink-100 transition-colors">
          <CheckSquare className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Task</span>
        </Link>
      </div>

      {/* Desktop Floating Action Button */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-50">
        <div className="relative">
          {/* Action Menu */}
          <div className={cn(
            "absolute bottom-full right-0 mb-4 flex flex-col items-end space-y-3 transition-all duration-300 origin-bottom",
            isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10 pointer-events-none"
          )}>
            <Link href={route('wedding.checklist.index')} className="flex items-center space-x-3 group cursor-pointer">
              <span className="bg-white dark:bg-neutral-950 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 shadow-sm border border-neutral-100 dark:border-neutral-800 group-hover:text-pink-600 transition-colors">
                Tambah Tugas
              </span>
              <button className="w-12 h-12 bg-white dark:bg-neutral-950 rounded-full flex items-center justify-center shadow-md border border-neutral-100 dark:border-neutral-800 text-purple-600 hover:bg-purple-50 transition-colors pointer-events-none">
                <CheckSquare className="w-5 h-5" />
              </button>
            </Link>
            
            <Link href={route('savings.index')} className="flex items-center space-x-3 group cursor-pointer">
              <span className="bg-white dark:bg-neutral-950 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 shadow-sm border border-neutral-100 dark:border-neutral-800 group-hover:text-pink-600 transition-colors">
                Tambah Tabungan
              </span>
              <button className="w-12 h-12 bg-white dark:bg-neutral-950 rounded-full flex items-center justify-center shadow-md border border-neutral-100 dark:border-neutral-800 text-green-600 hover:bg-green-50 transition-colors pointer-events-none">
                <PiggyBank className="w-5 h-5" />
              </button>
            </Link>

            <Link href={route('income.personal')} className="flex items-center space-x-3 group cursor-pointer">
              <span className="bg-white dark:bg-neutral-950 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 shadow-sm border border-neutral-100 dark:border-neutral-800 group-hover:text-pink-600 transition-colors">
                Tambah Pemasukan
              </span>
              <button className="w-12 h-12 bg-white dark:bg-neutral-950 rounded-full flex items-center justify-center shadow-md border border-neutral-100 dark:border-neutral-800 text-teal-600 hover:bg-teal-50 transition-colors pointer-events-none">
                <CreditCard className="w-5 h-5" />
              </button>
            </Link>

            <Link href={route('expenses.shared')} className="flex items-center space-x-3 group cursor-pointer">
              <span className="bg-white dark:bg-neutral-950 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 shadow-sm border border-neutral-100 dark:border-neutral-800 group-hover:text-pink-600 transition-colors">
                Add Shared Expense
              </span>
              <button className="w-12 h-12 bg-white dark:bg-neutral-950 rounded-full flex items-center justify-center shadow-md border border-neutral-100 dark:border-neutral-800 text-blue-600 hover:bg-blue-50 transition-colors pointer-events-none">
                <CreditCard className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Main FAB Toggle */}
          <button 
            onClick={toggleOpen}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shadow-pink-md text-white transition-all duration-300 hover:scale-105",
              isOpen ? "bg-neutral-800 rotate-45" : "bg-pink-600"
            )}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Backdrop for desktop menu */}
      {isOpen && (
        <div 
          className="hidden lg:block fixed inset-0 z-40 bg-white dark:bg-neutral-950/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

