'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Pause } from 'iconsax-react'

import VideoModal from '../../partner-space/_components/VideoModal'

const Hero = () => {
  return (
    <div
      className='flex  justify-between rounded-xl border border-[#A1BAF1] px-10 py-8'
      style={{
        background:
          'linear-gradient(95.75deg, #E4F8FF -9.27%, #FFFFFF 51.72%, #E1E1F8 112.7%)'
      }}
    >
      <div className='max-w-md space-y-7'>
        <div>
          <h3 className='text-shark-lg font-bold text-[#454284]'>
            Generate your Customer Overlap to improve opportunities by 7x in
            just 3 steps...
          </h3>
          <p className='mt-4 text-shark-sm text-[#524E8C]'>
            Identify the right opportunity, partners and enhance relationships
            by checking customer segment overlaps.
          </p>
        </div>
      </div>

      <VideoModal
        title=''
        videoUrl='https://storage.googleapis.com/sharkdom_resources/dashboard_play/PartnerMatch-vid-9-ae-final.mp4'
        thumbnailUrl='/video-placeholder.png'
      />
    </div>
  )
}

export default Hero
