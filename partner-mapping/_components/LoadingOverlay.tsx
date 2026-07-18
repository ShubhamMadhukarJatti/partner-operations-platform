'use client'

import React from 'react'
import { Loader2, Zap } from 'lucide-react'

export function LoadingOverlay() {
  return (
    <div className='absolute inset-0 z-[10] flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[2px] transition-all duration-300'>
      <div className='flex flex-col items-center gap-4 rounded-2xl border border-[#E4E7EE] bg-white p-8 shadow-2xl'>
        <div className='relative'>
          <div className='absolute inset-0 animate-ping rounded-full bg-[#3E50F7]/10' />
          <div className='relative flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F7FF]'>
            <Zap className='h-8 w-8 text-[#3E50F7]' />
          </div>
          <Loader2 className='absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-[#3E50F7]' />
        </div>

        <div className='space-y-1.5 text-center'>
          <h3 className='text-lg font-bold tracking-tight text-[#1A1A2E]'>
            Analyzing Overlaps
          </h3>
          <p className='max-w-[200px] text-xs leading-relaxed text-[#4D5C78]'>
            This may take a moment for larger datasets. We're matching accounts
            and identifying opportunities...
          </p>
        </div>

        <div className='mt-2 flex w-full max-w-[180px] gap-1'>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className='h-1 flex-1 rounded-full bg-[#E5EFFE]'>
              <div
                className='h-full animate-[loading-shimmer_1.5s_infinite] rounded-full bg-[#3E50F7]'
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading-shimmer {
          0% {
            opacity: 0.3;
            transform: scaleX(0);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
          100% {
            opacity: 0.3;
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  )
}
