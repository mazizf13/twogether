import React from 'react'
import { Activity, CreditCard, PiggyBank, CheckCircle, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/molecules/EmptyState'
import { IllustrationNoActivity } from '@/components/atoms/illustrations/IllustrationNoActivity'

interface ActorProps {
  uuid: string
  display_name: string
  avatar_url?: string | null
}

interface ActivityItemProps {
  id: number
  action: string
  description: string
  actor: ActorProps
  occurred_at: string
  icon: string
}

interface ActivityFeedProps {
  activities: ActivityItemProps[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'credit-card': return <CreditCard className="w-4 h-4 text-blue-500" />
      case 'piggy-bank': return <PiggyBank className="w-4 h-4 text-green-500" />
      case 'check-circle': return <CheckCircle className="w-4 h-4 text-purple-500" />
      case 'heart': return <Heart className="w-4 h-4 text-pink-500" />
      default: return <Activity className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
    }
  }

  const getIconBgColor = (iconName: string) => {
    switch (iconName) {
      case 'credit-card': return 'bg-blue-50 border-blue-100'
      case 'piggy-bank': return 'bg-green-50 border-green-100'
      case 'check-circle': return 'bg-purple-50 border-purple-100'
      case 'heart': return 'bg-pink-50 border-pink-100'
      default: return 'bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800'
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Recent Activity</h3>
      </div>

      <div className="flex-1">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-4">
            <EmptyState 
              illustration={<IllustrationNoActivity />}
              title="No activity yet"
              description="Your couple activity will appear here as you start planning."
            />
          </div>
        ) : (
          <div className="relative border-l border-neutral-100 dark:border-neutral-800 ml-4 space-y-6 pb-2">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-6 sm:pl-8">
                {/* Timeline node */}
                <span className={cn(
                  "absolute -left-[14px] flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white dark:bg-neutral-950",
                  getIconBgColor(activity.icon)
                )}>
                  {getIconComponent(activity.icon)}
                </span>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    {activity.actor.avatar_url ? (
                      <img src={activity.actor.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-[10px] font-bold">
                        {activity.actor.display_name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm text-neutral-700 dark:text-neutral-200">{activity.description}</span>
                  </div>
                  <span className="text-xs text-neutral-400 mt-1 sm:mt-0 whitespace-nowrap">
                    {activity.occurred_at}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

