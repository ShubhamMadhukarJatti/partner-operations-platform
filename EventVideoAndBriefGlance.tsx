'use client'

import React from 'react'
import { Play, X } from 'lucide-react'

import VideoPlayer from '@/components/common/VideoPlayer'

export interface EventVideoAndBriefGlanceProps {
  videoSrc: string
  videoPoster?: string
  contentTitle?: string
  /** When omitted, the prose section below the video is not rendered (e.g. homepage). */
  children?: React.ReactNode
  duration?: string
  buttonText?: string
}

export function EventVideoAndBriefGlance({
  videoSrc,
  videoPoster,
  contentTitle = 'Brief glance inside the event',
  children,
  duration = '30 min',
  buttonText = 'Watch Event'
}: EventVideoAndBriefGlanceProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Video preview */}
      <section className='px-4 py-10 sm:px-6 lg:px-10'>
        <div className='mx-auto w-full max-w-[1000px]'>
          <button
            type='button'
            onClick={() => setIsOpen(true)}
            aria-label='Open event video'
            className='group block w-full focus:outline-none'
          >
            <div className='relative aspect-video w-full overflow-hidden rounded-[20px] sm:rounded-3xl'>
              {videoPoster ? (
                <img
                  src={videoPoster}
                  alt='Event video poster'
                  className='h-full w-full object-cover'
                />
              ) : (
                <video
                  src={videoSrc}
                  className='h-full w-full object-cover'
                  muted
                  playsInline
                  preload='metadata'
                />
              )}

              {/* Only icon animation */}
              <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
                <div className='transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-active:translate-y-1'>
                  <div className='rounded-full bg-[radial-gradient(circle,rgba(205,200,255,0.95)_0%,rgba(205,200,255,0.82)_58%,rgba(205,200,255,0.45)_78%,rgba(205,200,255,0)_100%)] p-6 sm:p-7'>
                    <div className='rounded-full bg-black p-7 shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:p-8'>
                      <Play className='ml-1 h-10 w-10 fill-white text-white sm:h-12 sm:w-12' />
                    </div>
                  </div>
                </div>

                <div className='-mt-9 rounded-full bg-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.58)_45%,rgba(0,0,0,0.18)_78%,rgba(0,0,0,0)_100%)] px-6 py-3 text-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-[2px] transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-active:translate-y-1 sm:px-8 sm:py-4'>
                  <div className='text-[14px] font-semibold leading-none sm:text-[18px]'>
                    {buttonText}
                  </div>
                  <div className='mt-2 text-[12px] font-medium leading-none text-white/90 sm:text-[16px]'>
                    {duration}
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Modal */}
      {isOpen && (
        <div
          className='fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4'
          onClick={() => setIsOpen(false)}
        >
          <div
            className='relative w-full max-w-5xl'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='absolute -top-12 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-gray-100'
              aria-label='Close video modal'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='overflow-hidden rounded-[20px] bg-black shadow-2xl sm:rounded-[24px]'>
              <div className='aspect-video w-full'>
                <video
                  src={videoSrc}
                  poster={videoPoster}
                  controls
                  autoPlay
                  playsInline
                  className='h-full w-full'
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {children != null && (
        <section className='bg-white sm:py-16 lg:py-20'>
          <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
            <div className='prose prose-base mx-auto max-w-none sm:prose-lg'>
              <h2 className='mb-6 text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl lg:text-4xl'>
                {contentTitle}
              </h2>
              <div className='space-y-5 text-base text-gray-700 sm:space-y-6 sm:text-lg'>
                {children}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
