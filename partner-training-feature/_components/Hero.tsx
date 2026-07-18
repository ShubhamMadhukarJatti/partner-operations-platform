import Image from 'next/image'

import VideoPlayer from '@/components/common/VideoPlayer'

const BANNER_BG = '/assets/home/banner_bg.png'

const Hero = () => {
  return (
    <section className='relative flex min-h-[70vh] w-full items-center overflow-hidden pt-20'>
      {/* Background Image */}
      <div className='absolute inset-0 -z-10 h-full w-full'>
        <Image
          src={BANNER_BG}
          alt='Hero Background'
          fill
          priority
          className='object-cover object-center'
          quality={100}
        />
      </div>

      {/* Main Content */}
      <div className='mx-auto w-full max-w-6xl px-4 pt-8 md:px-8'>
        <div className='flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between'>
          {/* Left Content */}
          <div className='flex flex-col gap-6 lg:max-w-[55%]'>
            <h1
              className='font-s font-semibold leading-[1.1] tracking-tight'
              style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
            >
              <span className='text-[var(--text-black)]'>
                30-day, behavior-first training partners are 3× more likely to
                register a deal
              </span>
            </h1>
            <p className='max-w-[500px] text-xl leading-[28px] text-[var(--text-black-light)]'>
              Shift onboarding from passive content to small, measurable actions
              faster activation means faster pipeline and predictable partner
              revenue.
            </p>
          </div>

          {/* Right Image */}
          <div className='relative w-full max-w-[500px] lg:w-[45%]'>
            <VideoPlayer
              src='https://storage.googleapis.com/sharkdom_resources/hero_section/30%20days%20training%20video.mp4'
              autoPlay={true}
              muted={true}
              loop={true}
              controls={false}
              showOverlayControls={false}
              height={{ base: '300px', md: '450px' }}
              containerMaxWidth='full'
              containerClassName='!my-0'
              className='!my-0 !shadow-none [&>div>div]:rounded-3xl [&>div]:!m-0 [&>div]:!max-w-none'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
