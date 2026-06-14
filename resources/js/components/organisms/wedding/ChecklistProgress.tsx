import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface ChecklistProgressProps {
  total: number
  completed: number
  terlewat: number
  pct: number
}

export function ChecklistProgress({ total, completed, terlewat, pct }: ChecklistProgressProps) {
  // SVG donut chart properties
  const radius = 36
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (pct / 100) * circumference

  return (
    <div className="flex items-center space-x-6">
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#fce7f3" // pink-100
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={pct === 100 ? '#22c55e' : '#ec4899'} // green-500 or pink-500
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-none">{pct}%</span>
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        {pct === 100 && total > 0 ? (
          <div className="text-green-600 font-bold text-lg">
            🎉 All tasks complete!
          </div>
        ) : (
          <div className="text-neutral-700 dark:text-neutral-200 font-medium">
            <span className="text-neutral-900 dark:text-neutral-100 font-bold">{completed}</span> of {total} tasks done
          </div>
        )}
        
        {terlewat > 0 && pct < 100 && (
          <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 w-max">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            {terlewat} terlewat
          </div>
        )}
      </div>
    </div>
  )
}

