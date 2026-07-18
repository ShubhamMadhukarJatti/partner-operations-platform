import Image from 'next/image'

type SpeakerSectionProps = {
  eyebrow?: string
  title: string
  imageSrc:
    | { src: string; linkdirect: string }
    | { src: string; linkdirect: string }[]
  imageAlt?: string
}

const MeetOurSpeaker = ({
  eyebrow = 'Event Speakers',
  title,
  imageSrc,
  imageAlt = 'Section image'
}: SpeakerSectionProps) => {
  const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc]

  return (
    <section className='bg-[var(--background-meet)] py-24'>
      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-20 text-center'>
          {eyebrow && <p className='text-lg'>{eyebrow}</p>}
          <h2 className='mb-6 text-4xl font-medium leading-[66px] text-gray-900'>
            {title}
          </h2>
        </div>

        {/* Images */}
        {images.length === 1 ? (
          <div className='relative mx-auto h-[340px] w-full overflow-hidden lg:w-[500px]'>
            <Image
              src={images[0].src}
              alt={imageAlt}
              fill
              className='object-cover'
            />
          </div>
        ) : (
          <div className='flex flex-wrap justify-center gap-6'>
            {images.map(({ src, linkdirect }, index) => (
              <div
                key={linkdirect}
                className='relative h-[260px] w-full max-w-[280px] cursor-pointer overflow-hidden rounded-lg sm:w-[280px]'
                onClick={() => window.open(linkdirect, '_blank')}
              >
                <Image
                  src={src}
                  alt={`${imageAlt} ${index + 1}`}
                  fill
                  // className='object-cover'
                  onClick={() => window.open(linkdirect, '_blank')}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MeetOurSpeaker
