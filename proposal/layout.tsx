// src/app/(app)/proposal/layout.tsx
'use client'

import React from 'react'

import AllPageTopbar from '@/app/(app)/(dashboard-pages)/_components/layout/all-page-topbar'

export default function ProposalLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen w-full flex-col overflow-hidden'>
      <AllPageTopbar />
      <main className='hide-scrollbar flex-1 overflow-y-auto'>{children}</main>
    </div>
  )
}
