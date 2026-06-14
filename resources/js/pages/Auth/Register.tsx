import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { z } from 'zod'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { FormField } from '@/components/molecules/FormField'
import { PasswordInput } from '@/components/molecules/PasswordInput'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const registerSchema = z.object({
  display_name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string()
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation']
})

export default function Register() {
  const { data, setData, post, processing, errors, setErrors, clearErrors } = useForm({
    display_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const [zodErrors, setZodErrors] = useState<Record<string, string>>({})

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setZodErrors({})
    clearErrors()

    const result = registerSchema.safeParse(data)
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as string
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message
        }
      })
      setZodErrors(fieldErrors)
      return
    }

    post('/register')
  }

  return (
    <AuthLayout 
      title="Create an Account" 
      subtitle="Join Twogether and start planning your forever."
    >
      <form onSubmit={submit} className="space-y-6">
        <FormField 
          label="Your Name" 
          error={zodErrors.display_name || errors.display_name}
        >
          <Input
            id="display_name"
            name="display_name"
            value={data.display_name}
            autoComplete="name"
            autoFocus
            onChange={(e) => setData('display_name', e.target.value)}
            placeholder="e.g. Alice"
          />
        </FormField>

        <FormField 
          label="Email Address" 
          error={zodErrors.email || errors.email}
        >
          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
            placeholder="you@example.com"
          />
        </FormField>

        <FormField 
          label="Password" 
          error={zodErrors.password || errors.password}
        >
          <PasswordInput
            id="password"
            name="password"
            value={data.password}
            autoComplete="new-password"
            onChange={(e) => setData('password', e.target.value)}
            placeholder="At least 8 characters"
          />
        </FormField>

        <FormField 
          label="Confirm Password" 
          error={zodErrors.password_confirmation || errors.password_confirmation}
        >
          <PasswordInput
            id="password_confirmation"
            name="password_confirmation"
            value={data.password_confirmation}
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            placeholder="Confirm your password"
          />
        </FormField>

        <Button 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white" 
          disabled={processing}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-pink-600 hover:text-pink-500 underline underline-offset-4"
        >
          Log in
        </Link>
      </div>
    </AuthLayout>
  )
}

