import React from 'react'

import { cn } from '@/lib/utils'

type Props = {
  isCompleted: boolean
  step1Title?: string
  step2Title?: string
}

const PersonaModalStep = ({
  isCompleted,
  step1Title = 'Upload File',
  step2Title = 'Map Columns'
}: Props) => {
  return (
    <div className=' grid grid-cols-2 gap-2'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          {isCompleted ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
            >
              <circle cx='14' cy='14' r='14' fill='#83C413' />
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M18.7464 9.45412L11.5864 16.3641L9.68641 14.3341C9.33641 14.0041 8.78641 13.9841 8.38641 14.2641C7.99641 14.5541 7.88641 15.0641 8.12641 15.4741L10.3764 19.1341C10.5964 19.4741 10.9764 19.6841 11.4064 19.6841C11.8164 19.6841 12.2064 19.4741 12.4264 19.1341C12.7864 18.6641 19.6564 10.4741 19.6564 10.4741C20.5564 9.55412 19.4664 8.74412 18.7464 9.44412V9.45412Z'
                fill='white'
              />
            </svg>
          ) : (
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full bg-primary-light-blue text-base font-bold leading-5 text-background-white '
              )}
            >
              1
            </span>
          )}

          <span className='text-sm font-bold leading-4 text-text-80'>
            {step1Title}
          </span>
        </div>
        <div
          className={cn(
            'h-2.5 w-full rounded-full',
            !isCompleted ? 'bg-primary-light-blue' : 'bg-semantic-success'
          )}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <span
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full bg-text-60 text-base font-bold leading-5 text-background-white ',
              {
                'bg-primary-light-blue': isCompleted
              }
            )}
          >
            2
          </span>

          <span className='text-sm font-bold leading-4 text-text-80'>
            {step2Title}
          </span>
        </div>
        <div
          className={cn(
            'h-2.5 w-full rounded-full',
            !isCompleted ? 'bg-shark-blue-50' : 'bg-primary-light-blue'
          )}
        />
      </div>
    </div>
  )
}

export default PersonaModalStep
