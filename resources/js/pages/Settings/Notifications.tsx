import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import { SettingsLayout } from '@/components/templates/SettingsLayout'
import { Info } from 'lucide-react'

export default function Notifications({ user, couple, preferences }: any) {
  const { data, setData, put, processing } = useForm({
    partner_added_expense: preferences.partner_added_expense ?? true,
    partner_added_contribution: preferences.partner_added_contribution ?? true,
    partner_completed_task: preferences.partner_completed_task ?? true,
    milestone_reached: preferences.milestone_reached ?? true,
    wedding_countdown_reminders: preferences.wedding_countdown_reminders ?? true,
  })

  // Auto-save function when a toggle is clicked
  const handleChange = (key: string, value: boolean) => {
    setData(key as any, value)
    
    // Slight timeout to let state update before putting
    setTimeout(() => {
      put(route('settings.notifications.update'), {
        preserveScroll: true,
      })
    }, 50)
  }

  const Toggle = ({ label, description, checked, onChange }: any) => (
    <div className="flex items-center justify-between py-4">
      <div className="pr-4">
        <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">{label}</div>
        {description && <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${checked ? 'bg-pink-600' : 'bg-neutral-200'}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-neutral-950 shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )

  return (
    <SettingsLayout currentSection="Notifikasi" coupleName={couple?.name} partnerName={couple?.partner_a?.id === user.id ? couple?.partner_b?.display_name : couple?.partner_a?.display_name}>
      <Head title="Notification Preferences" />
      
      <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden mb-8">
        
        <div className="bg-pink-50/50 border-b border-pink-100 p-4 md:px-8 flex items-start space-x-3">
          <Info className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
          <p className="text-sm text-pink-900">
            <strong>Notification delivery coming soon.</strong> Set your preferences now, and they will be applied once email and push notifications are fully enabled in the next update.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Notification Preferences</h2>
          
          <div className="space-y-2 max-w-xl divide-y divide-neutral-100">
            
            <div className="pb-2">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Couples Activity</h3>
              <Toggle 
                label="Partner adds a shared expense"
                description="When your partner logs a new shared expense or payment."
                checked={data.partner_added_expense}
                onChange={(v: boolean) => handleChange('partner_added_expense', v)}
              />
              <Toggle 
                label="Partner contributes to savings"
                description="When your partner adds funds to the wedding savings."
                checked={data.partner_added_contribution}
                onChange={(v: boolean) => handleChange('partner_added_contribution', v)}
              />
              <Toggle 
                label="Partner completes a task"
                description="When your partner checks off an item on the checklist."
                checked={data.partner_completed_task}
                onChange={(v: boolean) => handleChange('partner_completed_task', v)}
              />
            </div>

            <div className="pt-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Milestones & Planning</h3>
              <Toggle 
                label="Savings milestones reached"
                description="Celebrate when you hit 25%, 50%, 75%, and 100% of your goals."
                checked={data.milestone_reached}
                onChange={(v: boolean) => handleChange('milestone_reached', v)}
              />
              <Toggle 
                label="Wedding countdown reminders"
                description="Get excited at the 6-month, 3-month, 1-month, and 1-week marks."
                checked={data.wedding_countdown_reminders}
                onChange={(v: boolean) => handleChange('wedding_countdown_reminders', v)}
              />
            </div>

          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}


