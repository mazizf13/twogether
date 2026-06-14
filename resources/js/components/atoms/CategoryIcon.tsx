import React from 'react'
import { 
  Building2, Utensils, Camera, Shirt, Mail, Sparkles, Music, 
  Plane, Diamond, UtensilsCrossed, Car, ShoppingBag, Heart, 
  BookOpen, Lightbulb, MoreHorizontal 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryIconProps {
  category: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CategoryIcon({ category, size = 'md', className }: CategoryIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const getCategoryConfig = (cat: string) => {
    switch (cat) {
      // Shared (Wedding) Categories
      case 'venue': return { icon: Building2, color: 'text-rose-600', bg: 'bg-rose-100' }
      case 'catering': return { icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'photography': return { icon: Camera, color: 'text-sky-600', bg: 'bg-sky-100' }
      case 'attire': return { icon: Shirt, color: 'text-violet-600', bg: 'bg-violet-100' }
      case 'invitations': return { icon: Mail, color: 'text-pink-600', bg: 'bg-pink-100' }
      case 'decorations': return { icon: Sparkles, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' }
      case 'music': return { icon: Music, color: 'text-indigo-600', bg: 'bg-indigo-100' }
      case 'honeymoon': return { icon: Plane, color: 'text-cyan-600', bg: 'bg-cyan-100' }
      case 'rings_jewelry': return { icon: Diamond, color: 'text-teal-600', bg: 'bg-teal-100' }
      
      // Personal Categories
      case 'food_dining': return { icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-50' }
      case 'transportation': return { icon: Car, color: 'text-blue-500', bg: 'bg-blue-50' }
      case 'shopping': return { icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' }
      case 'health': return { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' }
      case 'education': return { icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' }
      case 'bills_utilities': return { icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' }
      case 'wedding': return { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' }
      
      default: return { icon: MoreHorizontal, color: 'text-neutral-500 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800' }
    }
  }

  const config = getCategoryConfig(category)
  const Icon = config.icon

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center shrink-0",
      config.bg,
      config.color,
      sizeClasses[size],
      className
    )}>
      <Icon className={iconSizes[size]} />
    </div>
  )
}
