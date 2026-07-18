import React from 'react'

import { Button } from '@/components/ui/button'

type Props = {
  onExplore?: () => void
}

const OfflinePartnersDataBanner = ({ onExplore }: Props) => {
  return (
    <div
      className='w-full rounded-lg p-6'
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className='flex items-center justify-between text-white'>
        <div className='flex-1'>
          <h2 className='mb-2 text-xl font-semibold'>Explore more Partners</h2>
          <p className='text-base opacity-90'>
            Turn your partner list into live intelligence. Get insights,
            forecasts, and collaboration all in one place.
          </p>
        </div>

        <div className='ml-6'>
          <Button
            onClick={onExplore}
            className='bg-white px-6 py-2 font-medium text-blue-700 hover:bg-gray-100'
          >
            Explore
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OfflinePartnersDataBanner
