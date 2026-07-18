'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import { LogoIcon } from '@/components/icons/logo'

type Props = {
  isSignUp: boolean
}

const AuthScreenSlider = ({ isSignUp }: Props) => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  return (
    <div className='relative h-full  w-full  '>
      <div className='absolute left-12 top-12 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#FBFCFF] shadow-lg'>
        <LogoIcon className='h-8' />
      </div>
      <div className='absolute right-0 top-0 '>
        <svg
          width='826'
          height='324'
          viewBox='0 0 633 229'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle cx='413.828' cy='-184.656' r='412.918' stroke='#C8CFDC' />
        </svg>
      </div>
      <div className='absolute bottom-0 left-0 '>
        <svg
          width='499'
          height='250'
          viewBox='0 0 458 179'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle
            opacity='0.2'
            cx='207.785'
            cy='250.49'
            r='249.111'
            stroke='#C8CFDC'
          />
        </svg>
      </div>

      <Carousel
        plugins={[plugin.current]}
        className='h-full w-full flex-1 ' // Carousel takes full height
        opts={{
          loop: true
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className=' '>
          {!isSignUp ? (
            <CarouselItem>
              <div className='absolute top-32'>
                <Image
                  src={'/login-bg-1.png'}
                  width={651.62}
                  height={536}
                  alt=''
                />

                <p className='ml-10 mt-6 max-w-lg text-shark-lg font-medium text-text-80'>
                  Companies creating person’a have 356% more chances of find
                  their Ideal Partner
                </p>
              </div>
            </CarouselItem>
          ) : (
            <CarouselItem>
              <div className='absolute top-32'>
                <Image
                  src={'/login-bg-4.png'}
                  width={686.62}
                  height={496}
                  alt=''
                />

                <p className='ml-10 mt-6 max-w-lg text-shark-lg font-medium text-text-80'>
                  Sharkdom is a partnership management platform designed to
                  connect businesses and foster meaningful collaborations.
                </p>
              </div>
            </CarouselItem>
          )}

          <CarouselItem className=' '>
            <div className='absolute top-32 w-full'>
              <Image
                src={'/login-bg-2.png'}
                width={631.62}
                height={536}
                alt=''
              />

              <p className='ml-10 mt-6 max-w-lg text-shark-lg font-medium text-text-80'>
                Manage your current partner pipeline within the platform
                increasing your partner success rate by 3x
              </p>
            </div>
          </CarouselItem>
          <CarouselItem className=''>
            <div className='absolute top-32 w-full'>
              <Image
                src={'/login-bg-3.png'}
                width={651.62}
                height={501}
                alt=''
              />

              <p className='ml-10 mt-6 max-w-lg text-shark-lg font-medium text-text-80'>
                Enable your partner Interaction with fully automated Email
                Campaigns
              </p>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default AuthScreenSlider
