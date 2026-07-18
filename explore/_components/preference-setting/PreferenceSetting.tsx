import React from 'react'

import PreferenceDialog from './PreferenceDialog'

const PreferenceSetting = () => {
  return (
    <div className='flex flex-col gap-4 rounded-lg bg-[#12263A] p-4 text-white'>
      <p className='text-sm font-semibold'>Set your filter</p>
      <p className='text-xs '>
        Are you looking for a perfect partnership match for your future.
        <br />
        Filter your choices by answering few simple questions.
      </p>

      <PreferenceDialog />
    </div>
  )
}

export default PreferenceSetting
