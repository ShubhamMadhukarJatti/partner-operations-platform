import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import Calculate from '../_components/home-v2/Calculate'
import Hero from '../book-demo/_components/Hero'
import ClearSpace from './_components/ClearSpace'
import ColorsSection from './_components/ColorsSection'
import LogoSection from './_components/LogoSection'
import MistakeSection from './_components/MistakeSection'
import Partnership from './_components/Partnership'
import StyleGuidBanner from './_components/StyleGuidBanner'

const BrandingPage = () => {
  return (
    <div className='bg-[linear-gradient(to_bottom,_#F94F2F1A,_#F957303D,_#FFB70733,_#F94F2F4F,_#FFB70761,_#FFFFFF46,_#FCAA3F1A)]'>
      <MaxWidthWrapper>
        <div className='px-4 py-14 lg:px-0'>
          <h1 className='mb-14 text-center text-[48px] font-bold text-[#242424] lg:text-[64px]'>
            Sharkdom brand guidelines
          </h1>
          <StyleGuidBanner />
        </div>

        <div className='flex flex-col gap-[120px] px-4 pb-40 text-[#242424] lg:px-0'>
          <LogoSection />
          <ClearSpace />
          <ColorsSection />
          <Partnership />
          <MistakeSection />
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default BrandingPage
