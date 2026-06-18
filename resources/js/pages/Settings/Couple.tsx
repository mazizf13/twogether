import React, { useState } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { SettingsLayout } from '@/components/templates/SettingsLayout'
import { Calendar, AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Couple({ user, couple }: any) {
  const partner = couple ? (couple.partner_a.id === user.id ? couple.partner_b : couple.partner_a) : null

  const { data, setData, put, processing, errors } = useForm({
    name: couple?.name || '',
    wedding_date: couple?.wedding_date || '',
    currency_code: couple?.currency_code || 'IDR',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('settings.couple.update'), {
      preserveScroll: true,
    })
  }

  // Preview countdown
  const getDaysUntil = (dateStr: string) => {
    if (!dateStr) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const wedding = new Date(dateStr)
    wedding.setHours(0, 0, 0, 0)
    const diff = wedding.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  const daysUntil = getDaysUntil(data.wedding_date)

  if (!couple) {
    return (
      <SettingsLayout currentSection="Pengaturan Pasangan">
        <Head title="Pengaturan Pasangan" />
        <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">You are not in a couple space</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">Complete the onboarding process to invite a partner and unlock couple features.</p>
          <Link href={route('onboarding.index')} className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700">
            Go to Onboarding
          </Link>
        </div>
      </SettingsLayout>
    )
  }

  return (
    <SettingsLayout currentSection="Pengaturan Pasangan" coupleName={couple.name} partnerName={partner?.display_name}>
      <Head title="Pengaturan Pasangan" />
      
      <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Couple Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Couple Name</label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="E.g. Reza & Dinda's Journey"
                className="w-full rounded-xl border border-pink-200 dark:border-pink-900/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white dark:bg-neutral-950"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="wedding_date" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Tanggal Pernikahan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="wedding_date"
                  type="date"
                  value={data.wedding_date}
                  onChange={e => setData('wedding_date', e.target.value)}
                  className="w-full pl-10 rounded-xl border border-pink-200 dark:border-pink-900/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white dark:bg-neutral-950"
                />
              </div>
              {daysUntil !== null && daysUntil > 0 && (
                <p className="mt-2 text-sm text-pink-600 font-medium">Your wedding is in {daysUntil} days!</p>
              )}
              {errors.wedding_date && <p className="mt-1 text-xs text-rose-500">{errors.wedding_date}</p>}
            </div>

            <div>
              <label htmlFor="currency_code" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Primary Currency</label>
              <Select value={data.currency_code} onValueChange={val => setData('currency_code', val)}>
                <SelectTrigger id="currency_code">
                  <SelectValue placeholder="Pilih mata uang..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                  <SelectItem value="MYR">MYR - Malaysian Ringgit</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">This currency will be used for all expenses and savings targets.</p>
              {errors.currency_code && <p className="mt-1 text-xs text-rose-500">{errors.currency_code}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SettingsLayout>
  )
}



