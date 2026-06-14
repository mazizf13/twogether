import React, { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface LeaveCoupleModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  coupleName: string
  partnerName: string
}

export function LeaveCoupleModal({ isOpen, onClose, onConfirm, coupleName, partnerName }: LeaveCoupleModalProps) {
  const [confirmText, setConfirmText] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (confirmText === 'LEAVE') {
      onConfirm()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="p-6">
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Leave Couple Space?</h2>
          
          <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-3 mb-6">
            <p>You are about to leave <strong>{coupleName}</strong>.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your personal expenses will remain private to you.</li>
              <li>Shared expenses and savings will remain with <strong>{partnerName}</strong>.</li>
              <li>This action cannot be undone — you would need to create a new couple space.</li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Type "LEAVE" to confirm
            </label>
            <input 
              type="text" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 focus:ring-rose-500 focus:border-rose-500 text-neutral-900 dark:text-neutral-100 font-medium placeholder-neutral-300"
              placeholder="LEAVE"
              autoComplete="off"
            />
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={confirmText !== 'LEAVE'}
              className="flex-1 px-4 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Leave Couple Space
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
