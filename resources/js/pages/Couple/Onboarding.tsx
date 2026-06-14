import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import { OnboardingLayout } from '@/components/templates/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Heart, Clock, Gift, CreditCard, CheckCircle2, Copy } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { IllustrationWaiting } from '@/components/atoms/illustrations/IllustrationWaiting'

interface TertundaInvitation {
  id: number
  email: string
  token: string
}

interface OnboardingProps {
  hasCouple: boolean
  coupleStatus?: string
  pendingInvitation?: TertundaInvitation | null
  userEmail: string
}

export default function Onboarding({ 
  hasCouple, 
  coupleStatus, 
  pendingInvitation,
  userEmail
}: OnboardingProps) {
  // If couple is active, we start at step 2. If no couple, we stay at step 1.
  const initialStep = hasCouple && coupleStatus === 'active' ? 2 : 1
  const [step, setStep] = useState(initialStep)
  
  const [inviteEmail, setInviteEmail] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [inviteProcessing, setInviteProcessing] = useState(false)

  // Wizard Form Data
  const { data, setData, post, processing } = useForm<{
    couple_name: string
    wedding_date: Date | undefined
    currency_code: string
    budget_cents: string
  }>({
    couple_name: '',
    wedding_date: undefined,
    currency_code: 'IDR',
    budget_cents: '',
  })

  const [skipDate, setSkipDate] = useState(false)
  const [skipBudget, setSkipBudget] = useState(false)

  // Logic for Step 1: Sending Invite
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setInviteProcessing(true)
    router.post(route('couple.create'), { invited_email: inviteEmail }, {
      preserveState: true,
      onFinish: () => setInviteProcessing(false)
    })
  }

  const handleResendInvite = () => {
    if (!pendingInvitation) return
    setInviteProcessing(true)
    router.post(route('couple.invite'), { invited_email: pendingInvitation.email }, {
      preserveState: true,
      onFinish: () => setInviteProcessing(false)
    })
  }

  const copyInviteLink = () => {
    if (!pendingInvitation) return
    const link = `${window.location.origin}/invite/${pendingInvitation.token}`
    navigator.clipboard.writeText(link)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Logic for Final Step Submit
  const handleComplete = () => {
    post(route('onboarding.complete'), {
      preserveScroll: true
    })
  }

  // Next/Prev Handlers
  const nextStep = () => setStep(s => Math.min(s + 1, 5))
  const prevStep = () => setStep(s => Math.max(s - 1, 2)) // Cannot go back to step 1

  // -- RENDER STEPS --

  const renderStep1 = () => {
    if (coupleStatus === 'pending' && pendingInvitation) {
      return (
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto flex items-center justify-center mb-6">
            <IllustrationWaiting />
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-serif">
            Waiting for your partner...
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-300 text-lg">
            We've sent an invitation to <strong className="text-neutral-900 dark:text-neutral-100">{pendingInvitation.email}</strong>. 
            Once they accept, your couple space will be ready!
          </p>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4 text-left">
            <Label>Share the invite link directly</Label>
            <div className="flex space-x-2">
              <Input 
                value={`${window.location.origin}/invite/${pendingInvitation.token}`}
                readOnly
                className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400"
              />
              <Button variant="outline" onClick={copyInviteLink} className="shrink-0 w-24">
                {isCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button 
              variant="outline" 
              onClick={handleResendInvite} 
              disabled={inviteProcessing}
              className="w-full"
            >
              Resend Invitation Email
            </Button>
            
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Refresh this page once they've joined to continue setup.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-6 shadow-sm border-4 border-white">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 font-serif mb-4">
            Welcome to Twogether! 💕
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 text-lg">
            Let's set up your couple space. Invite your partner to start planning your forever.
          </p>
        </div>

        <form onSubmit={handleSendInvite} className="bg-white dark:bg-neutral-950 p-8 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 space-y-6 text-left">
          <div className="space-y-2">
            <Label htmlFor="partner_email">Your Partner's Email</Label>
            <Input
              id="partner_email"
              type="email"
              required
              placeholder="partner@example.com"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="h-12"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white h-12 text-lg shadow-pink-sm"
            disabled={!inviteEmail || inviteProcessing}
          >
            Send Invitation
          </Button>
        </form>
      </div>
    )
  }

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-serif mb-3">
          What should we call your space?
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Give your couple space a special name. You can always change this later.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-950 p-8 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="couple_name">Couple Name</Label>
          <Input
            id="couple_name"
            placeholder="e.g. Reza & Dinda's Journey"
            value={data.couple_name}
            onChange={e => setData('couple_name', e.target.value)}
            className="h-12 text-lg"
            autoFocus
          />
        </div>
      </div>

      <div className="flex space-x-4">
        {/* No back button if we started here */}
        {initialStep !== 2 && (
           <Button variant="outline" onClick={prevStep} className="flex-1 h-12">Back</Button>
        )}
        <Button onClick={nextStep} className="flex-1 h-12 bg-neutral-900 text-white hover:bg-neutral-800">
          Next &rarr;
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => {
    const daysUntil = data.wedding_date ? differenceInDays(data.wedding_date, new Date()) : null

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-serif mb-3">
            When's the big day? 📅
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Don't worry if you haven't decided yet — you can skip this for now.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 space-y-6 flex flex-col items-center">
          <div className={cn("transition-opacity duration-300", skipDate && "opacity-50 pointer-events-none")}>
            <Calendar
              mode="single"
              selected={data.wedding_date}
              onSelect={(d) => {
                setData('wedding_date', d)
                setSkipDate(false)
              }}
              className="rounded-md border-none p-0"
              classNames={{
                day_selected: "bg-pink-600 text-white hover:bg-pink-600 hover:text-white focus:bg-pink-600 focus:text-white",
                day_today: "bg-pink-50 text-pink-900",
              }}
              disabled={(date) => date < new Date()}
            />
          </div>

          {data.wedding_date && !skipDate && (
            <div className="bg-pink-50 text-pink-700 py-3 px-6 rounded-full font-medium animate-in zoom-in duration-300">
              Your wedding is in {daysUntil} days! 🎊
            </div>
          )}

          <div className="flex items-center space-x-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 w-full justify-center">
            <Checkbox 
              id="skipDate" 
              checked={skipDate} 
              onCheckedChange={(c) => {
                setSkipDate(c as boolean)
                if (c) setData('wedding_date', undefined)
              }} 
            />
            <Label htmlFor="skipDate" className="font-normal cursor-pointer text-neutral-600 dark:text-neutral-300">
              We haven't decided yet
            </Label>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" onClick={prevStep} className="flex-1 h-12">Back</Button>
          <Button onClick={nextStep} className="flex-1 h-12 bg-neutral-900 text-white hover:bg-neutral-800" disabled={!data.wedding_date && !skipDate}>
            Next &rarr;
          </Button>
        </div>
      </div>
    )
  }

  const renderStep4 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-serif mb-3">
          Do you have a budget in mind?
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          This helps us track your savings progress. Totally optional.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-950 p-8 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 space-y-6">
        <div className={cn("space-y-4 transition-opacity duration-300", skipBudget && "opacity-50 pointer-events-none")}>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select 
              value={data.currency_code} 
              onValueChange={v => setData('currency_code', v)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                <SelectItem value="MYR">MYR - Malaysian Ringgit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Total Budget Target</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 font-medium">
                {data.currency_code}
              </span>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="100000000"
                value={data.budget_cents}
                onChange={e => {
                  setData('budget_cents', e.target.value)
                  setSkipBudget(false)
                }}
                className="h-12 pl-14 text-lg tabular-nums"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Checkbox 
            id="skipBudget" 
            checked={skipBudget} 
            onCheckedChange={(c) => {
              setSkipBudget(c as boolean)
              if (c) setData('budget_cents', '')
            }} 
          />
          <Label htmlFor="skipBudget" className="font-normal cursor-pointer text-neutral-600 dark:text-neutral-300">
            We'll figure it out later
          </Label>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-12">Back</Button>
        <Button onClick={nextStep} className="flex-1 h-12 bg-neutral-900 text-white hover:bg-neutral-800" disabled={!data.budget_cents && !skipBudget}>
          Let's go! &rarr;
        </Button>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500 text-center">
      <div className="mx-auto w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center text-white mb-8 shadow-pink-md animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 font-serif mb-4">
          You're all set! 🎉
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-lg mb-8">
          Your couple space is ready. Here's what you can do together:
        </p>
      </div>

      <div className="grid gap-4 text-left mb-10">
        <div className="flex items-center space-x-4 bg-white dark:bg-neutral-950 p-4 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Track expenses together</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Split costs and settle up easily.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 bg-white dark:bg-neutral-950 p-4 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-500 shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Save for your dream wedding</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Watch your savings grow.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white dark:bg-neutral-950 p-4 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Plan every detail</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Use our default checklist or add your own tasks.</p>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleComplete} 
        disabled={processing}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white h-14 text-lg shadow-pink-md transition-transform hover:scale-105"
      >
        Go to Dashboard
      </Button>
    </div>
  )

  return (
    <OnboardingLayout 
      title="Couple Setup - Twogether" 
      currentStep={step > 1 && step < 5 ? step - 1 : undefined} // Offset step index for the indicator
      totalSteps={3} // Name, Date, Budget
    >
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </OnboardingLayout>
  )
}


