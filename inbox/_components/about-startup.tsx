import React from 'react'

import { Button } from '@/components/ui/button'

const AboutStartup = () => {
  return (
    <div className='flex flex-col gap-2 rounded-xl border border-[#D4D4D4] p-4'>
      <h6 className='text-base font-normal'>Tell me about your startup</h6>

      <Button className='mt-4 w-full'>Reply</Button>
    </div>
  )
}

export default AboutStartup
