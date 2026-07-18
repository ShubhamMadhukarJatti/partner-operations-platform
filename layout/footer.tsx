'use client'

import Link from 'next/link'
import { Linkedin, X } from 'lucide-react'

import type { PricingRegion } from '@/lib/pricing-region'

const footerLinks = [
  {
    title: 'Resources',
    links: [
      { title: 'Marketplace', url: '/discover' },
      { title: 'Book Demo', url: '/book-demo' },
      { title: 'Blogs', url: '/blog' },
      { title: 'Case Studies', url: '#' },
      { title: 'Expert Guide', url: '#' }
    ]
  },
  {
    title: 'Products',
    links: [
      { title: 'Docs', url: '#' },
      { title: 'Events', url: '/events' }
    ]
  },
  {
    title: 'Events',
    links: [
      {
        title: 'Build high performing partner ecosystem',
        url: '/high-performing-partner-ecosystem'
      },
      {
        title: 'Channel Strategies for Integration partners',
        url: '/channel-strategies-for-intergation-partners'
      },
      {
        title: 'All about partner sourced revenue',
        url: '/event/partner-source-revenue'
      }
    ]
  },
  {
    title: 'About',
    links: [
      { title: 'Contact Us', url: 'https://sharkdom.com/contact-us' },
      { title: 'Pricing', url: '/pricing' },
      { title: 'Refund Policy', url: 'https://sharkdom.com/refund-policy' },
      {
        title: 'Terms & Conditions',
        url: 'https://sharkdom.com/terms-and-conditions'
      },
      { title: 'Privacy Policy', url: 'https://sharkdom.com/privacy-policy' }
    ]
  },
  {
    title: 'Compare',
    links: [
      {
        title: 'Sharkdom Vs Partnerstack',
        url: '/compare/sharkdom-vs-partnerstack'
      },
      {
        title: 'Sharkdom Vs Crossbeam',
        url: '/compare/sharkdom-vs-crossbeam'
      },
      {
        title: 'Sharkdom Vs Impartner',
        url: '/compare/sharkdom-vs-impartner'
      },
      {
        title: 'Sharkdom Vs Partnerinsight.co',
        url: '/compare/sharkdom-vs-partnerinsight.io'
      },
      {
        title: 'Sharkdom Vs Kiflo',
        url: '/compare/sharkdom-vs-kiflo'
      },
      {
        title: 'Sharkdom Vs Zoho',
        url: '/compare/sharkdom-vs-zoho'
      }
    ]
  },
  {
    title: 'Solutions',
    links: [
      {
        title: 'Sharkdom for partnership teams',
        url: '/why-sharkdom/partner-managers'
      },
      {
        title: 'Sharkdom for GTM teams',
        url: '/why-sharkdom/growth-team'
      },
      {
        title: 'Sharkdom for sales teams',
        url: '/why-sharkdom/sales-team'
      }
    ]
  }
]

export const Footer = ({ initialRegion }: { initialRegion: PricingRegion }) => {
  const isIndia = initialRegion === 'India'

  return (
    <footer
      className='relative z-10 w-full overflow-hidden border-b-0 text-white shadow-none'
      style={{
        backgroundImage: "url('/footer_background.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#4A3F8F'
      }}
    >
      <div className='relative px-4 py-12 md:px-8 lg:px-20 lg:py-20'>
        <div className='flex max-w-4xl flex-col items-start justify-center'>
          <div className='mb-6'>
            <div className='flex items-center gap-2 rounded-full border-2 border-white px-6 py-2.5'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M8 0L10.4721 5.52786L16 8L10.4721 10.4721L8 16L5.52786 10.4721L0 8L5.52786 5.52786L8 0Z'
                  fill='#ffffff'
                />
              </svg>
              <span className='text-sm font-semibold text-white'>
                JOIN THE PARTNERSHIP REVOLUTION
              </span>
            </div>
          </div>

          <h2 className='mb-8 text-4xl font-medium leading-tight text-white md:text-5xl lg:text-7xl'>
            Ready to start your Partnership journey with us?
          </h2>

          <div className='mt-6 flex flex-col gap-4 lg:flex-row'>
            <Link
              href='/register'
              className='rounded-lg px-8 py-4 text-white'
              style={{
                background:
                  'linear-gradient(245.82deg, #311646 2.04%, #261136 82.72%)',
                boxShadow:
                  '0px 4px 8px 0px #FFFFFF4D inset, 0px 1px 2px 0px #0000001A'
              }}
            >
              Get Started
            </Link>

            <Link
              href='/book-demo'
              className='rounded-lg border border-white bg-white px-8 py-4 text-black'
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </div>

      <div className='border-t border-white/20' />

      <div className='px-4 pb-8 pt-10 md:px-8 lg:px-16'>
        <div className='grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 md:gap-x-8 md:gap-y-8 lg:justify-start lg:gap-x-24 lg:gap-y-8'>
          {footerLinks.map((linkGroup) => (
            <div key={linkGroup.title} className='flex min-w-0 flex-col gap-4'>
              <h3 className='text-base font-bold text-white'>
                {linkGroup.title}
              </h3>

              <div className='flex flex-col gap-3'>
                {linkGroup.links.map((link) => (
                  <Link
                    key={link.title}
                    href={link.url}
                    className='text-sm font-normal leading-snug text-white/80 transition-colors hover:text-white'
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='border-t border-white/20' />

      <div className='px-4 py-8 md:px-8 lg:px-16'>
        <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
              <a
                href='https://twitter.com/SharkdomIndia'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white transition-colors hover:text-white/80'
                aria-label='Twitter'
              >
                <X size={24} />
              </a>

              <a
                href='https://www.linkedin.com/company/sharkdomer/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white transition-colors hover:text-white/80'
                aria-label='LinkedIn'
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <h4 className='font-bold text-white lg:text-base xxl:text-lg'>
              {isIndia ? 'Kalasa Agile Pvt Ltd' : 'Kalasa Agile LLC'}
            </h4>

            <p className='text-sm text-white/80 lg:text-base'>
              support@sharkdom.com
            </p>

            <p className='text-sm text-white/80 lg:text-base'>
              {isIndia ? (
                <>
                  Cyberhub, 77-A, DLF Cyber City,
                  <br />
                  Gurugram, Haryana, 122015.
                </>
              ) : (
                <>
                  838 Walker RD STE 21-2
                  <br />
                  City of Dover, DE 19904
                </>
              )}
            </p>
          </div>
        </div>

        <div className='mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 sm:flex-row'>
          <p className='text-sm text-white/80 lg:text-base'>
            © All rights reserved.
          </p>

          <Link
            href='/privacy-policy'
            className='text-sm text-white/80 hover:text-white lg:text-base'
          >
            Privacy Policy
          </Link>

          <button
            type='button'
            onClick={() => window.open('https://trust.sharkdom.com', '_blank')}
            className='text-sm text-white/80 hover:text-white lg:text-base'
          >
            Trust Policy
          </button>
        </div>
      </div>
    </footer>
  )
}
