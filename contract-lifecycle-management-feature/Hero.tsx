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
      <div className='mx-auto w-full max-w-6xl px-4 md:px-8'>
        <div className='flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between'>
          {/* Left Content */}
          <div className='flex flex-col gap-6 lg:max-w-[50%]'>
            <h1
              className='font-bold leading-[1.1] tracking-tight'
              style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
            >
              <span style={{ color: '#101828' }}>Your</span>{' '}
              <span style={{ color: '#3C3CD4' }}>Loudest Partners</span>{' '}
              <span style={{ color: '#101828' }}>
                are not your best partners
              </span>
            </h1>
            <p
              className='max-w-[500px] leading-relaxed'
              style={{ fontSize: '20px', color: '#4A5565' }}
            >
              When partners show enthusiasm, by human nature we want to reward
              them even without outcomes yet but don&apos;t do without legal
              agreements signing.
            </p>
          </div>

          {/* Right Image */}
          <div className='relative w-full max-w-[500px] lg:w-[45%]'>
            <VideoPlayer
              src='https://storage.googleapis.com/sharkdom_resources/goof_partner.mp4'
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
