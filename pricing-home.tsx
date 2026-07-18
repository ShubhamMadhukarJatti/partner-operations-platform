'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

function PricingHome() {
  const [togglePaySwitch, setTogglePaySwitch] = useState(false)

  const PLAN_DETAILS = [
    {
      planType: 'Free',
      price: 0,
      description: 'best for early traction startup',
      tryForFree: '#',
      features: [
        '1 AI proposal generator',
        'Personalized recommendation',
        '24x email support'
      ],
      extraFeatures: ['-', '-', '-', '-', '-'],
      seat: 1
    },
    {
      planType: 'Standard',
      price: 649,
      description:
        'for mid stage companies with one or more member taking care of partnership with expertise',
      tryForFree: '#',
      features: [
        '2 AI proposal generator',
        'Personalized recommendation',
        '24x email support'
      ],
      extraFeatures: ['-', '-', '-', '-', '-'],
      seat: 2
    },
    {
      planType: 'Premium',
      price: 2499,
      description:
        'for early and mid stage companies with no or more then 1 member taking care of partnership',
      tryForFree: '#',
      features: [
        '5 AI proposal generator',
        'Personalized recommendation',
        'Quick 24x support'
      ],
      extraFeatures: [
        'Unrestricted access to Partner Valve Room',
        'Premium meet scheduling tools with your partner',
        'Partnership navigator bot(voice chat)',
        'Integration portal tools access',
        '-'
      ],
      seat: 4
    },
    {
      planType: 'Elite',
      price: 4799,
      description:
        'for early and mid stage companies with no or more then 1 member taking care of partnership',
      tryForFree: '#',
      features: [
        '20 AI proposal generator',
        'Personalized recommendation',
        'Quick 24x support'
      ],
      extraFeatures: [
        'Unrestricted access to Partner Valve Room',
        'Premium meet scheduling tools with your partner',
        'Partnership navigator bot(voice chat)',
        'All Integration portal tools access',
        'Quarterly Check-ins'
      ],
      seat: 10
    }
  ]

  const CUSTOMER_POSTS = [
    {
      name: 'Sid Kakkar',
      position: 'CEO at MiddleEven.ai',
      image: '/hero-tooltip-1.svg',
      post: 'Shardkom has really streamlined our flow of reaching out to AI companies which are Open for Partnership, amplify our solution onto their platform or solution to serve in interesting ways.'
    },
    {
      name: 'Vikesh Rao',
      position: 'Chief Growth Officer at SysMania',
      image: '/hero-tooltip-2.svg',
      post: 'We’re saving Sharkdom has made it easier to manage the partnership dynamics for our business, We no longer have to hesitate in reaching out to our partner for any update.'
    },
    {
      name: 'NiKhil Devergonda',
      position: 'Founder of FaceMap',
      image: '/hero-tooltip-3.svg',
      post: 'Our Research Part has been made simpler as earlier We use to find brands with common market segment but with Sharkdom,We no longer faces this problem.'
    },
    {
      name: 'Jim Gillespie',
      position: 'Alliance Manger at Macsick.ai',
      image: '/hero-tooltip-4.svg',
      post: 'It helps us reach to global Market, target right customer specially via partnering with Asian Companies and Made us sign MOU’s at much quicker rate.'
    },
    {
      name: 'Nathan Waugh',
      position: 'Partnership leader at krackic lab',
      image: '/hero-tooltip-5.svg',
      post: 'Sharkdom has helped us manage Partnership Dynamics with dozens of our partners and reduce barrier which we use to face earlier while communicating with out partner’s POC.'
    },
    {
      name: 'Takesuga Hidorika',
      position: 'Partner Manager at Hombie.io',
      image: '/hero-tooltip-6.svg',
      post: 'It made us easier for my partnership Team to keep track of our partners and find one at significantly faster pace.'
    }
  ]

  return (
    <section className='flex flex-col items-center gap-12 bg-white py-20 lg:gap-16'>
      <div className='relative pb-4'>
        <div className='flex flex-col items-center gap-3'>
          <p className='text-center text-3xl font-bold text-[#191D23] sm:text-5xl'>
            Powerful features for
          </p>
          <p className='bg-gradient-to-r from-[#1D4ED8] to-[#55CBFB] bg-clip-text text-center text-3xl font-bold text-transparent sm:text-5xl'>
            powerful Startups
          </p>
          <p className='text-center text-base text-[#191D23] sm:text-xl'>
            Choose a plan thats right for you
          </p>
        </div>
        {/* <div className='mt-14 flex flex-row items-center justify-center gap-6'>
          <p>Pay Monthly</p>
          <div
            className='w-12 rounded-full bg-gray-400 p-0.5'
            onClick={() => setTogglePaySwitch((prevState) => !prevState)}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white ${togglePaySwitch ? 'float-right' : 'float-left'}`}
            />
          </div>
          <div className='flex flex-col items-center'>
            <p>Pay Yearly</p>
            <p className='absolute -bottom-4 mb-3 block flex flex-row items-baseline gap-2 text-xs font-medium text-blue-600 md:hidden'>
              <CornerLeftUp size={16} />
              Save 25%
            </p>
          </div>
        </div>
        <div className='absolute hidden flex-row items-end md:-bottom-14 md:-right-12 md:flex'>
          <Image
            src={'/icons/curvy-arrow.svg'}
            width={100}
            height={70}
            alt='arrow'
          />
          <p className='text:xs mb-3 font-medium text-blue-600 sm:text-lg'>
            Save 25%
          </p>
        </div> */}
      </div>
      <div className='flex flex-col flex-wrap items-center justify-center gap-20 sm:flex-row sm:gap-8'>
        {PLAN_DETAILS.map((plan: any, index: number) => {
          return (
            <div
              key={plan.type}
              className='flex w-[300px] max-w-xs transform flex-col items-center gap-11 rounded-2xl border border-[#D4D4D4] bg-[#FFFFFF] px-10 pb-3 pt-10 transition duration-500 hover:scale-105'
            >
              <div className='flex h-36 flex-col items-center gap-4'>
                <p className='text-center text-lg font-bold text-black'>
                  {plan?.planType}
                </p>
                <p className='text-center'>
                  <span className='text-[36px] font-bold'>
                    ₹{plan?.price}
                    <span className='ml-1 text-base font-semibold text-gray-400'>
                      /mo
                    </span>
                  </span>
                </p>
                <p className='text-center text-xs font-medium text-[#1F1F1F]'>
                  {plan?.description}
                </p>
              </div>
              <div className='h-16'>
                <Button className='rounded-md px-8 py-6 text-[15px] font-semibold'>
                  <Link href='/onboarding-demo-register'>
                    {!plan?.price ? 'Start for free' : 'Buy Free plan'}
                  </Link>
                </Button>
                {!plan?.price ? null : (
                  <p className='mt-2 text-center text-xs font-medium text-[#1F1F1F]'>
                    or <span className='text-primary'>purchase now</span>
                  </p>
                )}
              </div>
              <div className='flex w-full flex-col items-center gap-2'>
                {plan?.features.map((feature: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className='flex flex-col items-center gap-2 text-[13px] text-[#454545]'
                    >
                      <p className='text-center'>{feature}</p>
                      <Separator className='w-40' />
                    </div>
                  )
                })}
              </div>
              <div className='mt-8 flex w-10/12 flex-col items-center gap-2'>
                {plan?.extraFeatures.map((feature: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className='flex flex-col items-center  gap-2 text-[13px] text-[#454545]'
                    >
                      <div className='h-8'>
                        <p
                          className={`text-center ${feature === '-' ? 'pt-4' : ''}`}
                        >
                          {feature}
                        </p>
                      </div>
                      <Separator className='w-40' />
                    </div>
                  )
                })}
                <p className='font-semibold text-primary'>
                  upto {plan?.seat} seat
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className='mt-8 w-full'>
        <div className='mx-auto flex w-4/5 flex-col gap-20 px-4'>
          <div className='flex flex-row flex-wrap items-center justify-between gap-8 lg:gap-0'>
            <div className='mb-8 w-full md:w-7/12'>
              <p className='text-2xl font-bold sm:text-4xl'>
                Trusted by{' '}
                <span className='text-primary'> Startup Companies </span>
                with <span className='text-primary'>big</span> growth goals
              </p>
            </div>
            <div className='flex flex-row items-center'>
              <Image
                src={'/assets/sprinkle-left.png'}
                width={30}
                height={50}
                alt='img'
              />
              <Image
                src={'/assets/community-partnerships-text.png'}
                width={500}
                height={20}
                alt={'text'}
              />
              <Image
                src={'/assets/sprinkle-right.png'}
                width={30}
                height={50}
                alt='img'
              />
            </div>
          </div>
          <div className='flex flex-row'>
            <Swiper
              className=''
              spaceBetween={30}
              slidesPerView={5}
              modules={[Navigation, Autoplay]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false
              }}
              loop={true}
              navigation
              breakpoints={{
                300: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
                600: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
                900: {
                  slidesPerView: 2
                },
                1200: {
                  slidesPerView: 3
                },
                1400: {
                  slidesPerView: 4,
                  spaceBetween: 20
                },
                2000: {
                  slidesPerView: 4,
                  spaceBetween: 20
                }
              }}
            >
              {CUSTOMER_POSTS.map((post: any, index: number) => {
                return (
                  <SwiperSlide
                    key={index}
                    className='flex min-h-48 max-w-xl flex-col justify-between border-l-2 border-l-gray-200'
                  >
                    <p className='pl-5 pt-3 text-sm italic sm:text-base'>
                      {post?.post}
                    </p>
                    <div className='mt-3 flex flex-row items-center gap-3 pl-2'>
                      <Image
                        src={post?.image}
                        width={69}
                        height={69}
                        alt='user'
                      />
                      <div>
                        <p className='text-sm sm:text-base'>{post?.name}</p>
                        <p className='text-xs text-gray-400 sm:text-base'>
                          {post?.position}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
          <div className='mx-auto'>
            <div className='mb-12 flex flex-row items-center justify-between'>
              <div className='flex basis-2/4 flex-col items-center gap-3'>
                <Image
                  className='mb-3'
                  width={250}
                  height={100}
                  src='/icons/rate-logo-1.svg'
                  alt='logo'
                />
                <Image
                  src='/icons/rating-stars.svg'
                  width={80}
                  height={40}
                  alt='rating'
                />
                <p className='text-center text-lg font-bold'>4.7/5</p>
              </div>
              <div className='flex basis-2/4 flex-col items-center justify-center gap-3'>
                <Image
                  width={50}
                  height={50}
                  src='/icons/rate-logo-2.svg'
                  alt='logo'
                />
                <Image
                  src='/icons/rating-stars.svg'
                  width={80}
                  height={40}
                  alt='rating'
                />
                <p className='text-center text-lg font-bold'>4.7/5</p>
              </div>
            </div>
            {/*<button className='mx-auto flex flex-row items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold text-white sm:text-base'>*/}
            {/*  Why customers choose Close{' '}*/}
            {/*  <ArrowRight className='hidden sm:block' size={16} />*/}
            {/*</button>*/}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingHome
