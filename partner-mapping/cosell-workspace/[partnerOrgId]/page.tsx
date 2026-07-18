'use client'

import { Suspense } from 'react'

import CoSellWorkspaceContent from '../../_components/CoSellWorkspaceContent'

function LoadingFallback() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#F9FAFB]'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-[#3E50F7] border-t-transparent' />
    </div>
  )
}

export default function CoSellWorkspacePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CoSellWorkspaceContent />
    </Suspense>
  )
}
