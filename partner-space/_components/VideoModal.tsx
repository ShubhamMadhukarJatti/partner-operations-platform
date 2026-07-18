/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import { CloseCircle } from 'iconsax-react'

interface VideoCardProps {
  title: string
  videoUrl: string
  thumbnailUrl: string
}

const VideoModal: React.FC<VideoCardProps> = ({
  title,
  videoUrl,
  thumbnailUrl
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePlay = () => {
    setIsModalOpen(true)
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play()
      }
    }, 100)
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsModalOpen(false)
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      {/* Video Card */}
      <div className='group h-full w-[585px] max-w-[585px] overflow-hidden rounded-lg shadow-lg'>
        {/* Card Container */}
        <div className='relative h-full w-full'>
          {/* Thumbnail */}
          <img
            src={thumbnailUrl}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            alt='Video thumbnail'
          />

          {/* Overlay with Play Button */}
          <div
            className='absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/20 transition-opacity duration-300 group-hover:bg-black/40'
            onClick={handlePlay}
          >
            {/* Play Button */}
            <svg
              width='56'
              height='56'
              viewBox='0 0 56 56'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='transform transition-transform duration-300 group-hover:scale-110'
            >
              <path
                d='M27.93 4.66406C15.05 4.66406 4.59668 15.1174 4.59668 27.9974C4.59668 40.8774 15.05 51.3307 27.93 51.3307C40.81 51.3307 51.2633 40.8774 51.2633 27.9974C51.2633 15.1174 40.8333 4.66406 27.93 4.66406ZM34.93 33.2007L28.1633 37.0974C27.3233 37.5874 26.39 37.8207 25.48 37.8207C24.5467 37.8207 23.6367 37.5874 22.7967 37.0974C21.1167 36.1174 20.1133 34.3907 20.1133 32.4307V24.6141C20.1133 22.6774 21.1167 20.9274 22.7967 19.9474C24.4767 18.9674 26.4833 18.9674 28.1867 19.9474L34.9533 23.8441C36.6333 24.8241 37.6367 26.5507 37.6367 28.5107C37.6367 30.4707 36.6333 32.2207 34.93 33.2007Z'
                fill='#E4E7EE'
              />
            </svg>

            {/* Title */}
            <div className='absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4'>
              <p className='text-lg font-bold text-white'>{title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 p-4'>
          <div className='relative w-full max-w-4xl rounded-lg bg-black'>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className='absolute -right-4 -top-4 z-[99] rounded-full bg-white p-2 shadow-lg transition-transform duration-200 hover:scale-110'
            >
              <CloseCircle size={24} color='#2A3241' />
            </button>

            {/* Video Player */}
            <video
              ref={videoRef}
              src={videoUrl}
              className='h-full w-full rounded-lg'
              controls
            />
          </div>
        </div>
      )}
    </>
  )
}

export default VideoModal
