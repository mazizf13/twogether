import React from 'react'

export function IllustrationWaiting() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Person 1 */}
      <circle cx="20" cy="24" r="8" stroke="#fbcfe8" strokeWidth="4"/>
      <path d="M10 48C10 42.4772 14.4772 38 20 38C25.5228 38 30 42.4772 30 48" stroke="#fbcfe8" strokeWidth="4" strokeLinecap="round"/>
      
      {/* Person 2 */}
      <circle cx="44" cy="24" r="8" stroke="#ec4899" strokeWidth="4"/>
      <path d="M34 48C34 42.4772 38.4772 38 44 38C49.5228 38 54 42.4772 54 48" stroke="#ec4899" strokeWidth="4" strokeLinecap="round"/>
      
      {/* Heart */}
      <path d="M32 30C32 30 28 26 32 22C36 26 32 30 32 30Z" fill="#ec4899"/>
    </svg>
  )
}
