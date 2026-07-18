'use client'

import React from 'react'
import ReactPlayer from 'react-player/lazy'

const CourseVideoPlayer = () => {
  return (
    <div className='relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 shadow-xl'>
      <ReactPlayer
        url='https://vimeo.com/459632439' // Dummy Vimeo video (random aesthetic one)
        width='100%'
        height='100%'
        controls
        light='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80' // Matching the abstract blue/purple vibe from screenshot
        playIcon={
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-white backdrop-blur-sm transition-transform hover:scale-110 dark:bg-card/10'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white pl-1 text-black dark:bg-card'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='currentColor'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-play'
              >
                <polygon points='6 3 20 12 6 21 6 3' />
              </svg>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default CourseVideoPlayer
