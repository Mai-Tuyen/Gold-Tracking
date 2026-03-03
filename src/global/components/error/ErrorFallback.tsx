'use client'

import Link from 'next/link'
import { FallbackProps } from 'react-error-boundary'

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white'>
      <div className='max-w-md space-y-6 text-center'>
        <h2 className='text-3xl font-semibold'>Something Went Wrong</h2>
      </div>
      <div className='mt-6 flex gap-4'>
        <button
          onClick={resetErrorBoundary}
          className='bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium backdrop-blur-sm transition-all duration-300'
        >
          Try Again
        </button>
        <Link
          href='/'
          className='bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium backdrop-blur-sm transition-all duration-300'
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
