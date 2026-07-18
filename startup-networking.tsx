import Image from 'next/image'

import collabora from '../../../../../public/images/clients/collabora-form.png'
import crunchbase from '../../../../../public/images/clients/crunchbase.png'
import digiLocker from '../../../../../public/images/clients/digi-locker.svg'
import founderscard from '../../../../../public/images/clients/founders-card.png'
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
  //   { name: 'faad', img: faad, href: 'https://www.faad.in' },
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
  }
]
const StartupsNetworking = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-6 overflow-x-hidden bg-white py-12 lg:mx-24 lg:py-24'>
      <p className='text-base font-medium  text-muted-foreground'>
        Join 100+ startups networking on Sharkdom
      </p>
      <div className='mt-4 max-w-[100vw] overflow-hidden'>
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
      </div>
    </section>
  )
}

export default StartupsNetworking
