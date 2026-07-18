import Image from 'next/image'

const BANNER_BG = '/assets/home/banner_bg.png'
const HERO_IMG = '/events/event_hero2.png'

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
        <div className='flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between'>
          {/* Left Content */}
          <div className='flex flex-col gap-6 lg:max-w-[50%]'>
            <h1
              className='font-bold leading-[1.1] tracking-tight'
              style={{ fontSize: 'clamp(36px, 5vw, 54px)', color: '#101828' }}
            >
              Go deeper into successful partnerships with partnership leaders
            </h1>
            <p
              className='max-w-[500px] leading-relaxed'
              style={{ fontSize: '20px', color: '#4A5565' }}
            >
              learn from industry known covering fireside chat
            </p>
          </div>

          {/* Right Image */}
          <div className='relative w-full max-w-[500px] lg:w-[45%]'>
            <Image
              src={HERO_IMG}
              alt='Events Hero'
              width={600}
              height={500}
              className='h-auto w-full object-contain'
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
