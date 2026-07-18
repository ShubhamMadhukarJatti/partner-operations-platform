'use client'

import React, { useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

import { showCustomToast } from '@/components/custom-toast'

import styles from './VideoPlayer.module.css'

interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  showOverlayControls?: boolean
  /** Use 16:9 aspect ratio instead of fixed pixel heights (e.g. modals, embedded players). */
  aspectVideo?: boolean
  containerClassName?: string
  height?: { base: string; md: string }
  containerMaxWidth?: string
  className?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  showOverlayControls = true,
  aspectVideo = false,
  containerClassName,
  height = { base: '300px', md: '500px' },
  containerMaxWidth = '6xl',
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleVideoError = () => {
    setIsLoading(false)
    showCustomToast(
      'Video Load Error',
      'Unable to load the video. Please try again later.',
      'error',
      5000
    )
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          await videoRef.current.play()
        }
      } catch (error) {
        console.error('Error playing video:', error)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return

    const container = videoRef.current.parentElement?.parentElement
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      } else if ((container as any).webkitRequestFullscreen) {
        ;(container as any).webkitRequestFullscreen()
      } else if ((container as any).mozRequestFullScreen) {
        ;(container as any).mozRequestFullScreen()
      } else if ((container as any).msRequestFullscreen) {
        ;(container as any).msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        ;(document as any).msExitFullscreen()
      }
    }
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        )
      )
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
    }
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  const handleLoadStart = () => {
    // Set a timeout to show play button even if metadata takes time
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const containerStyle = (
    aspectVideo
      ? {}
      : {
          '--video-height-base': height.base,
          '--video-height-md': height.md
        }
  ) as React.CSSProperties

  // Map containerMaxWidth to Tailwind classes
  const maxWidthClasses: Record<string, string> = {
    full: 'max-w-full',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    '8xl': 'max-w-8xl',
    '5xl': 'max-w-5xl',
    '4xl': 'max-w-4xl',
    '3xl': 'max-w-3xl',
    '2xl': 'max-w-2xl',
    xl: 'max-w-xl',
    lg: 'max-w-lg',
    md: 'max-w-md',
    sm: 'max-w-sm'
  }

  const maxWidthClass = maxWidthClasses[containerMaxWidth] || 'max-w-6xl'

  return (
    <div className={`mx-auto my-8 ${maxWidthClass} ${containerClassName}`}>
      <div
        className={`relative w-full overflow-hidden rounded-lg shadow-xl ${
          aspectVideo ? 'aspect-video h-auto min-h-0' : styles.videoContainer
        } ${className}`}
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          muted={isMuted}
          className={`h-full w-full ${aspectVideo ? 'object-cover' : ''}`}
          controls={controls}
          autoPlay={autoPlay}
          playsInline={true}
          preload='none'
          poster={poster}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onLoadStart={handleLoadStart}
          onTimeUpdate={handleTimeUpdate}
          onError={handleVideoError}
          loop={loop}
        >
          <source src={src} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        {/* Centered Play/Pause Button Overlay */}
        {showOverlayControls && (
          <div
            className='absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300'
            onClick={togglePlay}
          >
            <button
              className='flex h-20 w-20 items-center justify-center rounded-full bg-white text-gray-900 shadow-2xl transition-all hover:scale-110 hover:bg-white dark:bg-card dark:bg-card/90 dark:text-white'
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
            >
              {isPlaying ? (
                <Pause size={40} className='ml-0' />
              ) : (
                <Play size={40} className='ml-1' />
              )}
            </button>
          </div>
        )}

        {/* Video Controls */}
        {showOverlayControls && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-black/50 p-4 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className='flex items-center justify-center'>
              <div className='flex items-center gap-2'>
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className='rounded-full p-2 text-white transition-colors hover:bg-white dark:bg-card/20'
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className='rounded-full p-2 text-white transition-colors hover:bg-white dark:bg-card/20'
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer
