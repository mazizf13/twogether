import React from 'react'
import { Head, Link } from '@inertiajs/react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-4 text-center">
      <Head title="Page Not Found" />
      
      <h1 className="text-8xl font-bold font-serif mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 drop-shadow-sm">
        404
      </h1>
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        This page doesn't exist
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm">
        It might have been moved or deleted. Let's get you back to planning your big day.
      </p>
      
      <Link 
        href={route('dashboard')}
        className="px-6 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors shadow-pink-sm"
      >
        &larr; Go Home
      </Link>
    </div>
  )
}
