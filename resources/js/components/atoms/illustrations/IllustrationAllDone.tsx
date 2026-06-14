import React from 'react'

export function IllustrationAllDone() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" stroke="#ec4899" strokeWidth="4"/>
      <path d="M22 34L28 40L42 24" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Sparkles */}
      <path d="M52 16L54 12M52 16L56 18M52 16L48 14M52 16L50 20" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round"/>
      <path d="M12 48L14 44M12 48L16 50M12 48L8 46M12 48L10 52" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}
