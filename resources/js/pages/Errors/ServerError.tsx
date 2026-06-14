import React from 'react'
import { Head, Link } from '@inertiajs/react'

export default function ServerError() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-4 text-center">
      <Head title="Server Error" />
      
      <div className="mb-6">
        <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 54C32 54 14 40 14 26C14 18.268 20.268 12 28 12C31.5 12 34 14 34 14L28 26L38 34L32 54Z" fill="#fbcfe8" />
          <path d="M32 54C32 54 50 40 50 26C50 18.268 43.732 12 36 12C32.5 12 30 14 30 14L36 26L26 34L32 54Z" fill="#ec4899" />
          <path d="M32 14L38 26L28 34L32 54" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        Something went wrong
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400 mb-2 max-w-sm">
        We're on it — please try again in a moment.
      </p>
      <p className="text-pink-600 font-medium text-sm mb-8">
        Don't worry, your data is safe.
      </p>
      
      <div className="flex space-x-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-bold rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:bg-neutral-900 transition-colors"
        >
          Try again
        </button>
        <Link 
          href={route('dashboard')}
          className="px-6 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors shadow-pink-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
