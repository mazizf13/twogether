import React from 'react'
import { Link } from '@inertiajs/react'

interface EmptyStateProps {
  illustration: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ illustration, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full max-w-sm mx-auto">
      <div className="mb-6 w-32 h-32 flex items-center justify-center bg-pink-50 rounded-full">
        {illustration}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
      <p className="text-neutral-500 dark:text-neutral-400 mb-6">{description}</p>
      
      {action && (
        action.href ? (
          <Link 
            href={action.href}
            className="px-6 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-sm"
          >
            {action.label}
          </Link>
        ) : (
          <button 
            onClick={action.onClick}
            className="px-6 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-sm"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
