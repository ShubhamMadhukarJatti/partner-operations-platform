'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function CatalogPage() {
  return (
    <div className='relative min-h-screen bg-[#FAFBFC]'>
      <div className='flex w-full flex-col items-center'>
        <div className='flex w-full flex-col gap-0 px-[5%] pb-12 pt-8 md:px-[10%]'>
          <Link
            href='/deal-pipeline'
            className='mb-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:underline'
          >
            <ArrowLeft size={18} /> Back to Deal Pipeline
          </Link>
          <div className='mb-2 text-2xl font-bold text-[#1A202C]'>Catalog</div>
          <div className='mb-6 text-base text-[#6B7280]'>
            Catalog management feature coming soon
          </div>

          <div className='flex w-full flex-col items-center justify-center rounded-2xl border bg-white p-12'>
            <div className='flex flex-col items-center gap-4'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                <Lock size={32} className='text-gray-400' />
              </div>
              <h3 className='text-xl font-semibold text-[#1A202C]'>
                Feature Coming Soon
              </h3>
              <p className='max-w-md text-center text-sm text-[#6B7280]'>
                The Catalog feature is currently under development. Check back
                soon for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
