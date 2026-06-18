import React from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { SettingsLayout } from '@/components/templates/SettingsLayout'
import { useTheme } from '@/components/ThemeProvider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Profile({ user, couple }: any) {
  const { setTheme } = useTheme()
  const { data, setData, put, processing, errors } = useForm({
    display_name: user.display_name || '',
    avatar_url: user.avatar_url || '',
    theme: user.theme || 'light',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('settings.profile.update'), {
      preserveScroll: true,
      onSuccess: () => {
        setTheme(data.theme as any)
      }
    })
  }

  const partner = couple ? (couple.partner_a.id === user.id ? couple.partner_b : couple.partner_a) : null

  return (
    <SettingsLayout currentSection="Profil" coupleName={couple?.name} partnerName={partner?.display_name}>
      <Head title="Profile Settings" />
      
      <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 font-bold text-2xl overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                {data.avatar_url ? (
                  <img src={data.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.display_name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{data.display_name}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{user.email}</div>
                <div className="text-xs text-pink-600 font-medium">Avatar upload coming soon</div>
              </div>
            </div>

            <div>
              <label htmlFor="display_name" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Display Name</label>
              <input
                id="display_name"
                type="text"
                value={data.display_name}
                onChange={e => setData('display_name', e.target.value)}
                className="w-full rounded-xl border border-pink-200 dark:border-pink-900/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white dark:bg-neutral-950"
              />
              {errors.display_name && <p className="mt-1 text-xs text-rose-500">{errors.display_name}</p>}
            </div>

            <div>
              <label htmlFor="avatar_url" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Avatar URL (Optional)</label>
              <input
                id="avatar_url"
                type="url"
                value={data.avatar_url}
                onChange={e => setData('avatar_url', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full rounded-xl border border-pink-200 dark:border-pink-900/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white dark:bg-neutral-950"
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">For now, paste a direct URL to an image. File uploads are coming soon.</p>
              {errors.avatar_url && <p className="mt-1 text-xs text-rose-500">{errors.avatar_url}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-xl border border-pink-200 dark:border-pink-900/50 px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">To change your email, please contact support.</p>
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-bold text-neutral-700 dark:text-neutral-200 mb-1">Tema Tampilan (Theme)</label>
              <Select value={data.theme} onValueChange={val => setData('theme', val)}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Pilih tema..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Terang (Light)</SelectItem>
                  <SelectItem value="dark">Gelap (Dark)</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Pilih tema Black-Pink favoritmu. Perubahan akan berlaku setelah disimpan dan halaman di-refresh.</p>
              {errors.theme && <p className="mt-1 text-xs text-rose-500">{errors.theme as string}</p>}
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

        {partner && (
          <div className="p-6 md:p-8 bg-neutral-50 dark:bg-neutral-900">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4">Your Partner</h3>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 font-bold overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  {partner.avatar_url ? (
                    <img src={partner.avatar_url} alt="Partner Avatar" className="w-full h-full object-cover" />
                  ) : (
                    partner.display_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">{partner.display_name}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">{partner.email}</div>
                </div>
              </div>
              <Link href={route('settings.couple.show')} className="text-sm font-bold text-pink-600 hover:text-pink-700">
                Edit couple settings &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </SettingsLayout>
  )
}


