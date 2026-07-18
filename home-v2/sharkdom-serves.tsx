'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'iconsax-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

type Props = {}

const tabContent = [
  {
    value: 'startup',
    text: 'Founders should do partnership themselves before investing into partnership team. Sharkdom automates everything a founder needs without prior knowledge of how the process works.',
    img: '/serves-1.webp'
  },
  {
    value: 'msme',
    text: 'Companies where onboarding new partners are heftier then managing current partners. Sharkdom is the Industrial leader for Onboarding Partners according to your Product Market Fit.',
    img: '/serves-2.webp'
  },
  {
    value: 'enterprise',
    text: 'For Companies with 2 or more members in Partnership Team prioritizing managing of current partners. Sharkdom makes it easier to manage your current partners with minimum interaction and maximum enablement.',
    img: '/serves-3.webp'
  }
]

function MainContent({ text, img }: { text: string; img: string }) {
  return (
    <div className='mt-16 flex flex-col-reverse items-center justify-center gap-16 lg:flex-row '>
      <Image src={img} width={362} height={318} alt='' />

      <div className='flex w-full flex-col items-start '>
        <p className='mb-8 text-left text-shark-2xl text-white'>{text}</p>
        <Link href={'/register'}>
          <Button className='flex items-center gap-4 rounded-lg bg-primary-dark-blue bg-white text-shark-sm font-bold text-text-100 hover:bg-white'>
            Start my free 14-day trial <ArrowRight size={20} />
          </Button>
        </Link>
      </div>
    </div>
  )
}

const SharkdomServes = (props: Props) => {
  const [activeTab, setActiveTab] = useState('startup')

  const handleTabClick = (value: string) => {
    setActiveTab(value)
  }

  const currentTab = tabContent.find((tab) => tab.value === activeTab)

  return (
    <div className='flex flex-col items-center justify-start bg-primary-dark-blue px-4 py-20'>
      <MaxWidthWrapper className='xl:max-w-5xl'>
        <div className='text-center'>
          <div className='flex flex-col items-center gap-10'>
            <h4 className='text-center text-shark-5xl font-bold text-white'>
              Company Stages Served by Sharkdom
            </h4>
          </div>
          <div className='mt-10 flex w-full flex-col justify-center'>
            <div className='flex justify-center space-x-4'>
              {tabContent.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabClick(tab.value)}
                  className={cn(
                    'rounded-full border border-white px-6 py-2 text-shark-lg font-bold text-white ',
                    {
                      'bg-white text-black': activeTab === tab.value,
                      'bg-primary-dark-blue': activeTab !== tab.value
                    }
                  )}
                >
                  {tab.value === 'startup' && 'Startup'}
                  {tab.value === 'msme' && "MSME's"}
                  {tab.value === 'enterprise' && 'Enterprise'}
                </button>
              ))}
            </div>
            {currentTab && (
              <MainContent text={currentTab.text} img={currentTab.img} />
            )}
          </div>

          <div className='hidden'>
            {tabContent.map((tab) => (
              <Image
                key={tab.value}
                src={tab.img}
                width={1}
                height={1}
                alt=''
              />
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default SharkdomServes
