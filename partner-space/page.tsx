'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetSpace } from '@/http-hooks/partner-space'

import PageHeader from '@/components/shared/page-header'

import CreateSpaceDialog from './_components/CreateSpaceDialog'
import VideoModal from './_components/VideoModal'

const PartnerValveRoomPage = () => {
  const router = useRouter()
  const { data } = useGetSpace() as { data: any }
  console.log({ data })

  useEffect(() => {
    if (data && data?.length > 0) {
      router.replace('/partner-space/home')
    }
  }, [data, router])

  return (
    <div className='select-none'>
      <PageHeader
        title='Partner Valve Rooms'
        // description='Add subtext about partner valve rooms'
      />

      <div className='m-6 flex justify-between rounded-xl border border-[#A1BAF1] bg-gradient-to-r from-[#E4F8FF] via-[#FFFFFF] to-[#E1E1F8] px-10 py-8'>
        <div className='flex w-full flex-col gap-7 lg:w-[423px]'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-shark-lg font-bold text-[#454284]'>
              Effortless automation for tasks, real conversations with your
              partner’s POC
            </h2>
            <p className='text-shark-sm font-normal text-[#524E8C]'>
              99% Automation, 100% Personal Interaction – Where Your Partners
              Truly Connect
            </p>
          </div>
          <CreateSpaceDialog />
        </div>
        {/* <div className='h-full w-[585px] max-w-[585px]'>
          <div
            className='relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10'
            onMouseEnter={() => handleMouseEnterLeave(true)}
            onMouseLeave={() => handleMouseEnterLeave(false)}
          >
            <video
              ref={videoRef}
              muted
              className='z-10 mx-auto block w-auto rounded-lg sm:w-full'
              controls={true}
              autoPlay={true}
              playsInline={true}
              preload='metadata'
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              loop
            >
              <source
                src='https://storage.googleapis.com/sharkdom_resources/dashboard_play/partner-space-vid-11-ae-final-2.mp4'
                type='video/mp4'
              />
              <p>
                Your browser does not support the video tag. Please update your
                browser to watch this video.
              </p>
            </video>

            {showButton && (
              <div className='absolute z-20 flex h-0 w-0 items-center justify-center bg-black/40'>
                <button
                  className='flex items-center justify-center rounded-full bg-black/30 p-6 text-white focus:outline-none'
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  <p className='flex h-12 w-12 items-center justify-center rounded-full bg-primary p-4'>
                    {!isPlaying ? (
                      <span className='text-2xl'>&#9658;</span>
                    ) : (
                      <Pause size={28} />
                    )}
                  </p>
                </button>
              </div>
            )}
          </div>
        </div> */}
        <VideoModal
          title='Partner Space'
          videoUrl='https://storage.googleapis.com/sharkdom_resources/dashboard_play/partner-space-vid-11-ae-final-2.mp4'
          thumbnailUrl='/video-placeholder.png'
        />
      </div>
    </div>
  )
}

export default PartnerValveRoomPage
