import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { FormField } from '@/components/molecules/FormField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('password.email'))
  }

  if (status) {
    return (
      <AuthLayout 
        title="Check your inbox!" 
        subtitle="We've sent password reset instructions to your email."
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-pink-600" />
          </div>
          
          <p className="text-neutral-600 dark:text-neutral-300 mb-8">
            {status}
          </p>
          
          <div className="space-y-4 w-full">
            <Link href={route('login')} className="w-full block">
              <Button variant="outline" className="w-full">
                Return to log in
              </Button>
            </Link>
            
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Didn't receive it?{' '}
              <button 
                onClick={submit} 
                disabled={processing}
                className="font-medium text-pink-600 hover:text-pink-500 underline disabled:opacity-50"
              >
                Click to resend
              </button>
            </p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={submit} className="space-y-6">
        <FormField 
          label="Email Address" 
          error={errors.email}
        >
          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            autoComplete="username"
            autoFocus
            onChange={(e) => setData('email', e.target.value)}
            placeholder="you@example.com"
            className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
        </FormField>

        <Button 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white" 
          disabled={processing}
        >
          Send Reset Link
        </Button>
        
        <div className="text-center">
          <Link
            href={route('login')}
            className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800"
          >
            &larr; Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

