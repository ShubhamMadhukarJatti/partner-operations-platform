'use client'

import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

export function AnimatedHero() {
  return (
    <div className='mb-4 flex flex-col overflow-hidden'>
      <ContainerScroll
        titleComponent={
          <>
            {/* <h1 className="text-4xl font-semibold text-white">
            #1 Startup Partnership <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
              Marketplace
              </span>
            </h1> */}

            {/* <h1 className='text-center text-2xl font-extrabold text-white sm:text-4xl md:text-5xl'>
          #1 Startup Partnership <br /> Marketplace
        </h1> */}
            <div className='relative mt-8 flex flex-col justify-center'>
              <h1 className='text-center text-2xl font-extrabold text-[#0A1566] sm:text-4xl md:text-6xl'>
                {`Turning Someone's Competitors into Your Collaborators`}
              </h1>
            </div>
            <p className='py-8 text-center text-2xl text-[#33333]'>
              A new way of partnership without awkwardness specially designed
              for founders
            </p>
          </>
        }
      >
        {/* <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        /> */}

        <video
          className='lg:rounded-0 z-10 mx-auto block h-full w-[960px] lg:px-3'
          controls={false}
          autoPlay
          muted
          playsInline={false}
        >
          <source
            src="https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/Sharkdom's+Inside.mp4"
            type='video/mp4'
          />
          Your browser does not support the video tag.
        </video>
      </ContainerScroll>

      <div className='mb-12  flex  justify-center'>
        <Link href='/book-demo'>
          <Button className='h-14 bg-[#0A1566] px-20 text-lg font-semibold text-white'>
            Book a demo
          </Button>
        </Link>
      </div>
    </div>
  )
}
