import React from 'react'

import { Button } from '@/components/ui/button'

const UpdatedProposal = () => {
  return (
    <div className='flex flex-col gap-2 rounded-xl border border-[#D4D4D4] bg-[#F3F4F6] p-4'>
      <h6 className='text-base font-semibold'>
        Sharkdom has updated the proposal
      </h6>
      <p className='text-base'>1 point updated in expectations</p>
      <p>1 point added in offers</p>

      <Button className='mt-4 w-full'>View updated proposal</Button>
    </div>
  )
}

export default UpdatedProposal
