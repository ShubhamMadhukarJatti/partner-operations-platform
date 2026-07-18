import React from 'react'
import Image from 'next/image'

function NoLegalTeam() {
  return (
    <section className='relative mt-10 h-96 px-10 pb-0 pt-10 lg:mt-20 lg:h-[700px] lg:px-16 lg:pt-20'>
      <Image
        src={'/assets/no-legal-team-banner.png'}
        alt='no-legal-team-banner'
        fill
        className='object-cover'
      />
      <p className='absolute -top-6 right-8 rounded-full bg-[#1463FF] px-6 py-3 text-sm font-semibold uppercase text-white lg:right-48 lg:text-base'>
        For Partnership Team{' '}
      </p>
      <div className='relative mx-auto h-full w-full max-w-screen-xl'>
        <Image
          src={'/assets/quaterly-stats.png'}
          alt='quaterly-stats'
          className='absolute bottom-0'
          width={500}
          height={400}
        />
        <div>
          <p className='mb-2 text-right text-lg text-white lg:text-3xl'>
            Automating in most simplistic way
          </p>
          <h4 className='text-right text-4xl font-bold uppercase text-white lg:text-7xl'>
            No Legal Team <br /> Needed <br /> Anymore!
          </h4>
        </div>
      </div>
    </section>
  )
}

export default NoLegalTeam
