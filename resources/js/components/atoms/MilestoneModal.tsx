import React from 'react'
import { X } from 'lucide-react'
import { CurrencyAmount } from '@/components/atoms/CurrencyAmount'
import { cn } from '@/lib/utils'

interface MilestoneModalProps {
  milestone: number // 25, 50, 75, 100
  totalCents: number
  currencyCode: string
  onClose: () => void
}

export function MilestoneModal({ milestone, totalCents, currencyCode, onClose }: MilestoneModalProps) {
  const getMilestoneContent = (m: number) => {
    switch (m) {
      case 25: return { emoji: '🌟', title: "You're on your way!" }
      case 50: return { emoji: '🎊', title: "Halfway there!" }
      case 75: return { emoji: '💫', title: "Almost there!" }
      case 100: return { emoji: '🎉', title: "You did it!" }
      default: return { emoji: '✨', title: "Great progress!" }
    }
  }

  const content = getMilestoneContent(milestone)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 overflow-hidden">
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Simple CSS Confetti Background */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={cn(
              "absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full opacity-0 animate-[confetti_3s_ease-out_forwards]",
              i % 3 === 0 ? "bg-pink-500" : i % 3 === 1 ? "bg-purple-500" : "bg-yellow-400"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative bg-white dark:bg-neutral-950 rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-500 z-50">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-6xl md:text-7xl mb-6 animate-bounce" style={{ animationIterationCount: 3 }}>
          {content.emoji}
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{content.title}</h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Kalian telah mengumpulkan <strong className="text-pink-600">{milestone}%</strong> dari tabungan pernikahan - <CurrencyAmount cents={totalCents} currencyCode={currencyCode} className="font-bold text-neutral-900 dark:text-neutral-100" />!
        </p>
        
        <button 
          onClick={onClose}
          className="w-full px-6 py-4 bg-pink-600 text-white rounded-xl font-bold text-lg hover:bg-pink-700 transition-transform active:scale-95 shadow-pink-md"
        >
          Keep going! →
        </button>
      </div>
      
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

