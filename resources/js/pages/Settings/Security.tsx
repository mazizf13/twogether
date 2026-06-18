import React, { useState, useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { SettingsLayout } from '@/components/templates/SettingsLayout'
import { cn } from '@/lib/utils'
import { ShieldCheck, MonitorSmartphone } from 'lucide-react'

export default function Security({ user, couple }: any) {
  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const [strength, setStrength] = useState(0)
  const [strengthLabel, setStrengthLabel] = useState('Weak')
  const [strengthColor, setStrengthColor] = useState('bg-neutral-200')

  useEffect(() => {
    const pwd = data.password
    let score = 0
    
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (pwd.length === 0) {
      setStrength(0)
      setStrengthLabel('Weak')
      setStrengthColor('bg-neutral-200')
    } else if (score < 3) {
      setStrength(33)
      setStrengthLabel('Weak')
      setStrengthColor('bg-rose-500')
    } else if (score < 5) {
      setStrength(66)
      setStrengthLabel('Fair')
      setStrengthColor('bg-amber-500')
    } else {
      setStrength(100)
      setStrengthLabel('Strong')
      setStrengthColor('bg-green-500')
    }
  }, [data.password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('settings.security.password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    })
  }

  return (
    <SettingsLayout currentSection="Keamanan" coupleName={couple?.name} partnerName={couple?.partner_a?.id === user.id ? couple?.partner_b?.display_name : couple?.partner_a?.display_name}>
      <Head title="Security Settings" />
      
      <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Change Password</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            
            <div>
              <label htmlFor="current_password" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Current Password</label>
              <input
                id="current_password"
                type="password"
                value={data.current_password}
                onChange={e => setData('current_password', e.target.value)}
                className="w-full rounded-xl border border-pink-200 dark:border-pink-900/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white dark:bg-neutral-950"
              />
              {errors.current_password && <p className="mt-1 text-xs text-rose-500">{errors.current_password}</p>}
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <label htmlFor="password" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">New Password</label>
              <input
                id="password"
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                className="w-full rounded-xl border border-pink-200 dark:border-pink-900/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white dark:bg-neutral-950"
              />
              {/* Strength Indicator */}
              <div className="mt-2 flex items-center space-x-3">
                <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-300 rounded-full", strengthColor)}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <div className={cn("text-xs font-bold w-12 text-right", strength > 0 ? strengthColor.replace('bg-', 'text-') : "text-neutral-400")}>
                  {strength > 0 ? strengthLabel : ''}
                </div>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Confirm New Password</label>
              <input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={e => setData('password_confirmation', e.target.value)}
                className="w-full rounded-xl border border-pink-200 dark:border-pink-900/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white dark:bg-neutral-950"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 shadow-sm"
              >
                {processing ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <MonitorSmartphone className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Aktif Sessions</h2>
          </div>
          
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white dark:bg-neutral-950 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">This Device</div>
                <div className="text-xs text-green-600 font-medium">Currently active</div>
              </div>
            </div>
            {/* V1.5 placeholder */}
            <button disabled className="text-sm font-bold text-neutral-400 opacity-50 cursor-not-allowed">
              Log out other devices
            </button>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">Session management across multiple devices will be available in V1.5.</p>
        </div>
      </div>
    </SettingsLayout>
  )
}



