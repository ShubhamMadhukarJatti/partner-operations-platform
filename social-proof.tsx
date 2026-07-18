'use client'

import { useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import collabora from '../../../../../public/images/clients/collabora-form.png'
import crunchbase from '../../../../../public/images/clients/crunchbase.png'
import digiLocker from '../../../../../public/images/clients/digi-locker.svg'
import faad from '../../../../../public/images/clients/faad.png'
import founderscard from '../../../../../public/images/clients/founders-card.png'
import karostartup from '../../../../../public/images/clients/karostartup.png'
import nvidia from '../../../../../public/images/clients/nvidia.png'
import ovhcloud from '../../../../../public/images/clients/ovhcloud.png'
import razorpayx from '../../../../../public/images/clients/razorpayx.png'
import recur from '../../../../../public/images/clients/recur.png'
import strategyzer from '../../../../../public/images/clients/strategyzer.png'
import startuplab from '../../../../../public/images/clients/the-startup-lab.webp'
import upmetrics from '../../../../../public/images/clients/upmetrics.png'
import vakilsearch from '../../../../../public/images/clients/vakil-search.png'
import xartup from '../../../../../public/images/clients/xartup.png'

const partners = [
  {
    name: 'Crunchbase',
    img: crunchbase,
    href: 'https://www.crunchbase.com/'
  },
  {
    name: 'founders card',
    img: founderscard,
    href: 'https://founderscard.com/'
  },
  // { name: 'bitbook', img: bitbook, href: 'https://bitbook.ai/' },
  { name: 'ovhcloud', img: ovhcloud, href: 'https://www.ovhcloud.com/' },
  { name: 'razorpayx', img: razorpayx, href: 'https://razorpay.com/x/' },
  {
    name: 'strategyzer',
    img: strategyzer,
    href: 'https://www.strategyzer.com/'
  },
  { name: 'collabora form', img: collabora },
  { name: 'faad', img: faad, href: 'https://www.faad.in' },
  {
    name: 'nvidia',
    img: nvidia,
    href: 'https://www.nvidia.com/en-in/startups/'
  },
  { name: 'recur club', img: recur, href: 'https://recurclub.com/' },
  {
    name: 'the startup lab',
    img: startuplab,
    href: 'https://thestartuplab.in/'
  },
  { name: 'upmetrics', img: upmetrics, href: 'https://upmetrics.co/' },
  { name: 'vakil search', img: vakilsearch, href: 'https://vakilsearch.com/' },
  { name: 'digi locker', img: digiLocker, href: 'https://digilocker.gov.in/' },
  {
    name: 'Xartup',
    img: xartup,
    href: 'https://www.xartup.com/'
  },
  {
    name: 'Karostartup',
    img: karostartup,
    href: 'https://karostartup.com/'
  }
]

export const SocialProof = () => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }))

  return (
    <section className='flex  flex-col items-center justify-center gap-6 overflow-x-hidden bg-white pb-8 pt-28 lg:py-20'>
      <h2 className='mb-5 flex justify-center text-center text-3xl font-semibold leading-normal'>
        Here’s what other founders are saying
      </h2>
      {/* <h2 className='scroll-m-20 text-center text-3xl font-semibold tracking-tight'>
        Trusted by{' '}
        <span className='relative inline-block text-primary-foreground before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-primary'>
          <span className='relative text-white'>5000+</span>
        </span>{' '}
        startups
      </h2> */}
      {/* <div className='mt-4 max-w-[100vw] overflow-hidden'>
        <div className='flex w-max  animate-marquee items-stretch gap-[--gap] [--gap:theme(spacing.24)] hover:[animation-play-state:paused]'>
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              className='h-20 w-40 transition duration-300 hover:scale-110'
              target='_blank'
            >
              <Image
                src={partner.img}
                priority
                alt={partner.name}
                className='h-full object-contain'
              />
              <span className='sr-only'>{partner.name}</span>
            </a>
          ))}
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              className='h-20 w-40 transition duration-300 hover:scale-110'
              target='_blank'
            >
              <Image
                priority
                src={partner.img}
                alt={partner.name}
                className='h-full object-contain'
              />
              <span className='sr-only'>{partner.name}</span>
            </a>
          ))}
        </div>
      </div> */}

      <div className='container flex items-center justify-center'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full max-w-screen-md'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className='p-1'>
                  <div className='flex items-center justify-center p-2 sm:p-4'>
                    <Testimonial {...testimonial} />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div></div>
    </section>
  )
}

type TestimonialProps = {
  name: string
  company: string
  testimonial: string
}

const Testimonial = ({ name, company, testimonial }: TestimonialProps) => {
  return (
    <div className='mx-auto p-4 text-center'>
      <div className='mx-auto max-w-screen-md'>
        <div className='text-muted-foreground'>
          <svg
            className='mx-auto mb-3 h-12'
            viewBox='0 0 24 27'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z'
              fill='currentColor'
            />
          </svg>
        </div>
        <blockquote>
          <p className='text-lg lg:text-2xl'>{testimonial}</p>
        </blockquote>
        <div className='mt-6 flex items-center justify-center space-x-3'>
          <div className='flex items-center divide-x-2 divide-muted'>
            <div className='pr-3 font-medium'>{name}</div>
            <div className='pl-3 text-sm font-light '>{company}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const testimonials: { name: string; company: string; testimonial: string }[] = [
  {
    name: 'Nandkumar Mane',
    company: 'RoboResponse.AI',
    testimonial:
      'Sharkdom made it really streamline for us to reach out to other players in the world of AI especially to those tech which serves non-tech customers which want AI solutions without code and We could not have expected anything more then partnering with these players. Our website traffic became 30% more then before within first month of partnering with 2 tech startups.'
  },
  {
    name: 'Hemnaa',
    company: 'Devzery',
    testimonial:
      "When we earlier started our journey of automating SAAS solutions we end up using all tactics in the book of ethics to reach out to the needed but Sharkdom's solution of walking through other startups which provide to same market as we do made it easy for us to expand. We are conversing with more users to integrate our solution to their platform"
  }
]
