import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { FormField } from '@/components/molecules/FormField'
import { PasswordInput } from '@/components/molecules/PasswordInput'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function ResetPassword({ token, email }: { token: string, email: string }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('password.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    })
  }

  const isExpiredToken = errors.email?.includes('invalid') || errors.email?.includes('expired')

  if (isExpiredToken) {
    return (
      <AuthLayout 
        title="Link Expired" 
        subtitle="Your password reset link is invalid or has expired."
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <p className="text-neutral-600 dark:text-neutral-300 mb-8">
            For security reasons, password reset links expire after a short time. Please request a new one.
          </p>
          
          <Link href={route('password.request')} className="w-full block">
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
              Request New Link
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Please enter your new password below."
    >
      <form onSubmit={submit} className="space-y-6">
        {errors.email && !isExpiredToken && (
          <div className="p-4 rounded-md bg-red-50 text-red-600 flex items-start text-sm font-medium">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {errors.email}
          </div>
        )}

        <FormField label="Email Address">
          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            disabled
            className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
          />
        </FormField>

        <FormField 
          label="New Password" 
          error={errors.password}
        >
          <PasswordInput
            id="password"
            name="password"
            value={data.password}
            autoComplete="new-password"
            autoFocus
            onChange={(e) => setData('password', e.target.value)}
            placeholder="At least 8 characters"
            className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
        </FormField>

        <FormField 
          label="Confirm New Password" 
          error={errors.password_confirmation}
        >
          <PasswordInput
            id="password_confirmation"
            name="password_confirmation"
            value={data.password_confirmation}
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            placeholder="Confirm your new password"
            className={errors.password_confirmation ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
        </FormField>

        <Button 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white" 
          disabled={processing}
        >
          Set New Password
        </Button>
      </form>
    </AuthLayout>
  )
}

