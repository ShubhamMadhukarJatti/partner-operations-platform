'use client'

import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function PeepInside() {
  return (
    <React.Fragment>
      <div className='flex items-center justify-center'>
        <div className='relative px-6 pb-16 pt-20  lg:px-64 lg:py-20'>
          <h2 className='text-4xl font-bold'>Who can use Sharkdom?</h2>
          <div className='absolute left-28 top-6 flex lg:-right-16 lg:left-auto lg:top-3'>
            <Image
              src={'/icons/curvy-arrow.svg'}
              alt='curvy-arrow'
              width={100}
              height={80}
              className='w-16 rotate-[140deg] lg:w-24'
            />
            <Image
              src={'/assets/founders-only.png'}
              alt='founders-only'
              width={300}
              height={40}
              className='h-fit w-48 lg:w-72'
            />
          </div>
          <p className='absolute -bottom-4 left-8 z-10 rounded-full bg-[#1463FF] px-6 py-3 text-sm font-semibold uppercase text-white lg:-left-64 lg:text-base'>
            For Founder&apos;s and CXO&apos;s
          </p>
        </div>
      </div>
      <section className='relative flex h-[780px] flex-row items-center justify-center overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#121A2F] to-[#000000] sm:h-[700px]'>
        <Image
          className='absolute -bottom-7'
          src={'/assets/partner-networking-bg.png'}
          width={700}
          height={600}
          alt={'cover-bg'}
        />
        <div className='relative flex h-full w-full flex-col items-start justify-start gap-8 px-10 sm:flex-row sm:justify-between'>
          <div className='z-20 mt-16 flex flex-col items-center sm:basis-2/4'>
            <div>
              <p className='mb-2 text-white sm:text-lg lg:text-2xl xl:text-3xl'>
                Automating in most simplistic way
              </p>
              <div>
                <p className='text-4xl font-bold text-white lg:text-5xl xl:text-7xl'>
                  NO PARTNER
                </p>
                <p className='text-4xl font-bold text-white lg:text-5xl xl:text-7xl'>
                  MANAGER
                </p>
                <p className='text-4xl font-bold text-white lg:text-5xl xl:text-7xl'>
                  NEEDED ANYMORE
                </p>
              </div>
            </div>
          </div>
          <div className='z-20 mt-6 flex basis-2/4 flex-col gap-6 self-start sm:mt-16'>
            <div className='flex flex-row items-center gap-2 text-white md:text-2xl'>
              <div className='w-fit text-2xl'>
                <Check className='' color={'#ffffff'} />
              </div>
              <p>No Prior experience on partnership process needed</p>
            </div>
            <div className='flex flex-row items-center gap-2 text-white md:text-2xl'>
              <div className='w-fit text-2xl'>
                <Check className='' color={'#ffffff'} />
              </div>
              <p>
                No need for Team of multiple people to handle partnership for
                your business
              </p>
            </div>
            <div className='flex flex-row items-center gap-2 text-white md:text-2xl'>
              <div className='w-fit text-2xl'>
                <Check className='' color={'#ffffff'} />
              </div>
              <p>Save cost of a PM as We automate it for you</p>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}
