import '@vidstack/react/player/styles/base.css'

import { ReactNode } from 'react'
import {
  MediaPlayer,
  MediaProvider,
  Poster,
  type MediaPlayerProps
} from '@vidstack/react'

import { cn } from '@/lib/utils'

import { VideoLayout } from './components/layout'

interface VidstackPlayerProps extends Omit<MediaPlayerProps, 'children'> {
  src: string
  poster?: string
  children?: ReactNode // To allow overlays like the Badge in HomeVideoSection
}

export function VidstackPlayer({
  src,
  poster,
  className,
  children,
  ...props
}: VidstackPlayerProps) {
  const hasTransparentBg =
    className?.includes('!bg-transparent') ||
    className?.includes('bg-transparent')

  return (
    <MediaPlayer
      src={src}
      viewType='video'
      streamType='on-demand'
      logLevel='warn'
      playsInline
      className={cn(
        'relative m-0 overflow-hidden rounded-3xl',
        !hasTransparentBg && 'bg-slate-900 shadow-2xl ring-1 ring-white/10',
        className
      )}
      {...(props as any)}
    >
      <MediaProvider>
        {poster && (
          <Poster
            className='absolute inset-0 block h-full w-full rounded-3xl object-cover opacity-0 transition-opacity data-[visible]:opacity-100'
            src={poster}
            alt='Video poster'
          />
        )}
      </MediaProvider>

      <VideoLayout />

      {/* Allow custom children overlays (like the Badge) */}
      {children}
    </MediaPlayer>
  )
}
