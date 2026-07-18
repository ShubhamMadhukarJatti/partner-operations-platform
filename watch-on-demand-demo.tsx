'use client'

import { useCallback, useRef, useState } from 'react'
import { Pause } from 'lucide-react'

export default function WatchOnDemandDemo() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [showButton, setShowButton] = useState(true)

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying((prev) => !prev)
      setShowButton((prev) => !prev)
    }
  }, [isPlaying])

  const handleMouseEnterLeave = useCallback(
    (enter: boolean) => {
      if (enter || !isPlaying) setShowButton(true)
      else setShowButton(false)
    },
    [isPlaying]
  )

  return (
    <div className='flex flex-col items-center justify-start bg-primary-dark-blue py-20'>
      <div className='relative flex w-full max-w-5xl flex-col px-4'>
        <h4 className='mb-4 text-center text-3xl font-bold text-white sm:text-shark-5xl'>
          Watch Sharkdom in action
        </h4>

        <p className='text-center text-shark-2xl font-normal text-white'>
          Get a sneak peek into how Sharkdom uses cognitive mapping to find your
          ideal partners from over 7,000 startups.
        </p>

        <div
          className='relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-2xl'
          onMouseEnter={() => handleMouseEnterLeave(true)}
          onMouseLeave={() => handleMouseEnterLeave(false)}
        >
          <video
            ref={videoRef}
            className='z-10 mx-auto block h-auto w-auto rounded-lg sm:h-[540px] sm:w-[960px]'
            controls={false}
            autoPlay={false}
            playsInline={true}
            preload='metadata'
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source
              src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/editable/demo_homepage.mp4'
              type='video/mp4'
            />
            <p>
              Your browser does not support the video tag. Please update your
              browser to watch this video.
            </p>
          </video>

          {showButton && (
            <div className='absolute z-20 flex h-full w-full items-center justify-center bg-black/40'>
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
      </div>
    </div>
  )
}
