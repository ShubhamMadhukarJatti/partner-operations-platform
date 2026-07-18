'use client'

import React from 'react'
import Image from 'next/image'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

export default function TrustedPartners() {
  const TRUSTED_PARTNERS = [
    { icon: '/icons/partner-logo-1.svg', name: 'Razorpay' },
    { icon: '/icons/partner-logo-2.svg', name: 'Crunchbase' },
    { icon: '/icons/partner-logo-3.svg', name: 'DigiLocker' },
    { icon: '/icons/partner-logo-4.svg', name: 'FOUNDERSCARD' },
    { icon: '/icons/partner-logo-5.svg', name: 'NVIDIA Inception Program' },
    { icon: '/icons/partner-logo-6.svg', name: 'Tech in Asia' }
  ]

  return (
    <div className='bg-background-ghost-white'>
      <div className='mx-4 pb-20 pt-12 sm:mx-14'>
        <div className='mb-10'>
          <h4 className='text-center text-shark-4xl font-bold'>
            Backed by trusted partners
          </h4>
        </div>
        <div>
          <Swiper
            spaceBetween={30}
            slidesPerView={5}
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false
            }}
            loop={true}
            navigation={false}
            breakpoints={{
              300: {
                slidesPerView: 1,
                spaceBetween: 10
              },
              600: {
                slidesPerView: 2
              },
              900: {
                slidesPerView: 3
              },
              1200: {
                slidesPerView: 4
              },
              1400: {
                slidesPerView: 5,
                spaceBetween: 20
              }
            }}
          >
            {TRUSTED_PARTNERS.map((partner: any, index: number) => (
              <SwiperSlide
                key={index}
                className='flex flex-col items-center justify-center rounded-xl border border-text-60 bg-white py-8 pl-0'
              >
                {/*<div className='flex'>*/}
                <Image
                  src={partner.icon}
                  alt='trusted partner'
                  width={100}
                  height={100}
                  className='mx-auto min-h-[100px] min-w-[100px]'
                />
                {/*</div>*/}
                <p className='mt-2 text-center font-medium'>{partner.name}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}
