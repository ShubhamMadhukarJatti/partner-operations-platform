import React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const BANNER_FEATURES = [
  {
    icon: '/icons/set-compatibility.svg',
    alt: 'set-compatibility',
    title: 'See Compatibility',
    description: 'Spot high-fit partners instantly'
  },
  {
    icon: '/icons/forecast-performance.svg',
    alt: 'forecast-performance',
    title: 'Forecast Performance',
    description: 'Forecast impact before you commit'
  },
  {
    icon: '/icons/unify-communication.svg',
    alt: 'unify-communication',
    title: 'Unify Communication',
    description: 'Keep every partner on the same page.'
  },
  {
    icon: '/icons/smart-decisions.svg',
    alt: 'smart-decision',
    title: 'Make Smarter Decision',
    description: 'Turn partner data into strategy.'
  }
]

type Props = {
  onExploreOpportunity?: () => void
  onImportPartners?: () => void
  buttonRef?: React.Ref<HTMLButtonElement>
  shouldHighlight?: boolean
}

const OfflinePartnersInitialBanner = ({
  onExploreOpportunity,
  onImportPartners,
  buttonRef,
  shouldHighlight
}: Props) => {
  return (
    <div
      className='w-full rounded-lg p-8'
      style={{
        background: 'linear-gradient(135deg, #6863FB 0%, #504CC6 100%)'
      }}
    >
      {/* Title and Description */}
      <div className='mb-8 flex flex-col items-center text-center text-white'>
        <h2 className='mb-2 text-xl font-semibold'>
          Import Your Partners to Unlock Sharkdom&apos;s Full Power
        </h2>
        <p className='max-w-2xl text-sm opacity-90'>
          Turn your partner list into live intelligence. Get insights,
          forecasts, and collaboration all in one place.
        </p>
      </div>

      {/* Four Attributes Row */}
      <div className='mx-auto mb-8 flex max-w-5xl items-start justify-between gap-8'>
        {BANNER_FEATURES.map((feature, index) => (
          <div
            key={index}
            className='flex flex-col items-center text-center text-white'
          >
            <Image
              src={feature.icon}
              alt={feature.alt}
              width={48}
              height={48}
              className='mb-3'
            />
            <h3 className='mb-1 text-base font-semibold'>{feature.title}</h3>
            <p className='text-sm opacity-80'>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className='flex justify-center gap-4'>
        <Button
          onClick={onExploreOpportunity}
          variant='primary'
          className='px-6 py-2 font-medium'
        >
          Explore new opportunity
        </Button>
        <Button
          ref={buttonRef}
          onClick={onImportPartners}
          variant='primary'
          className={cn(
            'px-6 py-2 font-medium transition-all duration-300',
            shouldHighlight &&
              'scale-105 animate-pulse shadow-[0_0_25px_rgba(104,99,251,0.8)] ring-[6px] ring-[#6863FB]/40'
          )}
        >
          Import Partners
        </Button>
      </div>
    </div>
  )
}

export default OfflinePartnersInitialBanner
