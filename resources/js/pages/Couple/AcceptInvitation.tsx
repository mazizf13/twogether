import React from 'react'
import { Link, useForm, Head } from '@inertiajs/react'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { Button } from '@/components/ui/button'
import { Heart, AlertCircle, CheckCircle2 } from 'lucide-react'

interface InvitationData {
  token: string
  email: string
  status: string
  expires_at: string
}

interface AcceptInvitationProps {
  invitation: InvitationData
  inviterName: string
  isExpired: boolean
  isAccepted: boolean
  isLoggedIn: boolean
  userEmail?: string
}

export default function AcceptInvitation({
  invitation,
  inviterName,
  isExpired,
  isAccepted,
  isLoggedIn,
  userEmail
}: AcceptInvitationProps) {
  const { post, processing } = useForm()

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('invite.accept', { token: invitation.token }))
  }

  // Already accepted state
  if (isAccepted) {
    return (
      <AuthLayout 
        title="Already Joined" 
        subtitle="This invitation has already been accepted."
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 text-pink-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 mb-8">
            You are already part of a couple space.
          </p>
          <Link href={route('dashboard')} className="w-full block">
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Expired state
  if (isExpired) {
    return (
      <AuthLayout 
        title="Invitation Expired" 
        subtitle="This invitation link is no longer valid."
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 mb-8">
            For security reasons, invitations expire after 72 hours. Please ask {inviterName} to send you a new invitation.
          </p>
        </div>
      </AuthLayout>
    )
  }

  // Valid state
  return (
    <AuthLayout 
      title="You're Invited! 💕" 
      subtitle={`${inviterName} wants to plan your wedding together on Twogether.`}
    >
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold text-xl uppercase shadow-sm">
            {inviterName.charAt(0)}
          </div>
          <Heart className="w-8 h-8 text-pink-500 fill-current animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-xl uppercase shadow-sm border-2 border-white">
            ?
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 mb-8 w-full border border-neutral-100 dark:border-neutral-800 text-left">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">What you'll do together:</h3>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center"><span className="mr-2 text-pink-500">✓</span> Track all wedding expenses</li>
            <li className="flex items-center"><span className="mr-2 text-pink-500">✓</span> Save for your big day</li>
            <li className="flex items-center"><span className="mr-2 text-pink-500">✓</span> Manage your planning checklist</li>
          </ul>
        </div>

        <form onSubmit={handleAccept} className="w-full">
          {isLoggedIn ? (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 text-left">
                You are logged in as <strong>{userEmail}</strong>.
              </p>
              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg shadow-pink-sm" 
                disabled={processing}
              >
                Join Couple Space
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg shadow-pink-sm" 
                disabled={processing}
              >
                Create Account & Join
              </Button>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                You'll be asked to set a password to create your account.
              </p>
            </div>
          )}
        </form>
      </div>
    </AuthLayout>
  )
}

