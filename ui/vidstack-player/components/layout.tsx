import {
  Controls,
  formatTime,
  Gesture,
  TimeSlider,
  useMediaState
} from '@vidstack/react'

import { RipplePlayButton } from './play-button'
import { SeekBackwardButton, SeekForwardButton } from './seek-buttons'

function TimeRemained() {
  const currentTime = useMediaState('currentTime')
  const duration = useMediaState('duration')
  const remainder = Math.max(0, duration - currentTime)
  return <span>{formatTime(remainder)} left</span>
}

export function VideoLayout() {
  return (
    <>
      <Gesture
        className='absolute inset-0 z-0 block h-full w-full'
        event='pointerup'
        action='toggle:paused'
      />
      <Gesture
        className='absolute inset-0 z-0 block h-full w-full'
        event='dblpointerup'
        action='toggle:fullscreen'
      />

      <Controls.Root className='pointer-events-none absolute inset-0 z-10 flex h-full w-full flex-col bg-black/20 opacity-100 transition-opacity duration-300'>
        {/* Center Controls - Absolutely positioned for true centering */}
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center gap-12'>
          <div className='pointer-events-auto'>
            <SeekBackwardButton />
          </div>
          <div className='pointer-events-auto'>
            <RipplePlayButton />
          </div>
          <div className='pointer-events-auto'>
            <SeekForwardButton />
          </div>
        </div>

        {/* Spacer to push bottom section down */}
        <div className='flex-1' />

        {/* Bottom Section */}
        <div className='pointer-events-auto flex w-full flex-col gap-2 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-12'>
          {/* Time Display - Right most corner */}
          <div className='flex w-full items-center justify-end px-1 text-sm font-medium text-white'>
            <TimeRemained />
          </div>

          <TimeSlider.Root className='group relative mx-auto h-2 w-full cursor-pointer select-none items-center outline-none'>
            <TimeSlider.Track className='relative h-1 w-full rounded-sm bg-white/30 transition-all group-data-[focus]:h-2'>
              <TimeSlider.TrackFill className='absolute h-full w-[var(--slider-fill)] rounded-sm bg-white will-change-[width]' />
              <TimeSlider.Progress className='absolute h-full w-[var(--slider-progress)] rounded-sm bg-white/50 will-change-[width]' />
            </TimeSlider.Track>
            <TimeSlider.Thumb className='absolute left-[var(--slider-fill)] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 ring-2 ring-white/50 transition-opacity will-change-[left] group-data-[active]:opacity-100 group-data-[dragging]:ring-4' />
          </TimeSlider.Root>
        </div>
      </Controls.Root>
    </>
  )
}
