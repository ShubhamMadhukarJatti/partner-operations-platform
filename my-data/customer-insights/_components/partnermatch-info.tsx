import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'

import VideoModal from '../../../partner-space/_components/VideoModal'

type DataSource = 'csv' | 'hubspot' | 'sheets' | null

const PartnerMatchInfo = () => {
  return (
    <div
      className='flex items-center justify-between rounded-xl border border-[#A1BAF1] px-10 py-8'
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

        <div className=' flex items-center gap-7'>
          <Image
            src={'/hubspot.svg'}
            width={57.33}
            alt='csv-icon'
            height={57.33}
          />
          <Image src={'/csv.svg'} width={57.33} alt='csv-icon' height={57.33} />
          <Image
            src={'/sheets.svg'}
            width={57.33}
            alt='csv-icon'
            height={57.33}
          />
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

export default PartnerMatchInfo
