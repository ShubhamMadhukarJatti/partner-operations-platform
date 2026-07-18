'use client'

import { Plus } from 'lucide-react'

export function PartnerPortalFab() {
  return (
    <button
      type='button'
      aria-label='Quick add'
      className='absolute bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full bg-[#6863FB] text-white shadow-lg hover:bg-[#6863FB]/90'
    >
      <Plus className='size-7 stroke-[2.5]' aria-hidden />
    </button>
  )
}
