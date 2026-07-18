'use client'

import { useState } from 'react'
import Image from 'next/image'

import { BASIC_RESOURCES } from '@/lib/constants/resources'
import { CheckIcon } from '@/components/icons/icons'

import { VideoDialog } from './video-dialog'

const BasicResources = () => {
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string
    url: string
  } | null>(null)

  const handleView = (resource: (typeof BASIC_RESOURCES)[number]) => {
    if (resource.link) {
      setSelectedVideo({ title: resource.title, url: resource.link })
    }
  }

  return (
    <div className='flex flex-col'>
      <h3 className='text-shark-xl font-bold text-text-100'>
        Start from basics
      </h3>

      <div className='mt-4 flex flex-wrap items-center gap-5'>
        {BASIC_RESOURCES.map((resource, index) => (
          <div
            key={index}
            onClick={() => handleView(resource)}
            className='flex min-w-[307px] cursor-pointer flex-col items-start gap-4 rounded-xl border border-[#C8CFDC] bg-white p-4'
          >
            <div className='flex w-full items-center gap-4'>
              <div className='flex size-12 items-center justify-center rounded-lg border border-primary-blue bg-background-ghost-white '>
                <Image
                  src={resource.imgSrc || '/placeholder.svg'}
                  width={resource.imgWidth}
                  height={resource.imgHeight}
                  alt={resource.title}
                />
              </div>
              <div>
                <h5>{resource.title}</h5>
                <div className='mt-2 flex items-center gap-2'>
                  <CheckIcon />
                  <span className='text-shark-sm text-text-80'>
                    {resource.description}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <VideoDialog
        videoInfo={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  )
}

export default BasicResources
