import { PlayButton, useMediaState } from '@vidstack/react'
import { Pause, Play } from 'lucide-react'

export function RipplePlayButton() {
  const isPaused = useMediaState('paused')

  return (
    <div className='relative flex items-center justify-center'>
      {/* Ripple Effect - Only show when paused (i.e. showing the big play button) or maybe always? 
          Usually ripple is for attracting attention to play. */}
      {isPaused && (
        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30 opacity-75 duration-1000'></span>
      )}

      <PlayButton className='group relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 active:scale-95'>
        {isPaused ? (
          <Play className='ml-1 h-8 w-8 fill-white text-white' />
        ) : (
          <Pause className='h-8 w-8 fill-white text-white' />
        )}
      </PlayButton>
    </div>
  )
}
