import React from 'react'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ 
  label, 
  error, 
  hint, 
  required, 
  children,
  className 
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="flex justify-between items-baseline">
        <span>
          {label}
          {required && <span className="text-pink-600 ml-1">*</span>}
        </span>
        {hint && <span className="text-xs text-neutral-400 font-normal">{hint}</span>}
      </Label>
      
      {children}
      
      {error && (
        <div className="flex items-center text-sm text-red-500 font-medium">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

