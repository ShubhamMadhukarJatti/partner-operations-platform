'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  Box,
  Settings,
  Users
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'

import {
  whySharkdomMegaMenu,
  type WhySharkdomForLink,
  type WhySharkdomForLucideKey
} from './nav-data'

const FOR_LUCIDE: Record<
  WhySharkdomForLucideKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  box: Box,
  'badge-dollar': BadgeDollarSign,
  'bar-chart-3': BarChart3,
  users: Users
}

function SharkdomForRowIcon({ link }: { link: WhySharkdomForLink }) {
  if (link.featured && link.featuredIconSrc) {
    return (
      <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-white'>
        <Image
          src={link.featuredIconSrc}
          alt=''
          width={16}
          height={16}
          className='size-4 brightness-0'
        />
      </div>
    )
  }
  if (!link.icon) return null
  const I = FOR_LUCIDE[link.icon]
  return (
    <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#E6EEFF]'>
      <I className='size-4 text-[#2563EB]' strokeWidth={1.33} />
    </div>
  )
}

function SharkdomForRow({ link }: { link: WhySharkdomForLink }) {
  const inner = (
    <div
      className={cn(
        'flex w-full min-w-0 items-center justify-between gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F7F9FC]/80',
        link.featured &&
          'rounded-md bg-gradient-to-r from-[#E5EDFF] to-[#F3E3FF] hover:opacity-95'
      )}
    >
      <div className='flex min-w-0 flex-1 items-start gap-2.5'>
        <SharkdomForRowIcon link={link} />
        <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
          <p className='font-inter text-[14px] font-semibold leading-[17px] text-[#1B2331]'>
            {link.title}
          </p>
          <p className='font-inter text-[12px] font-medium leading-[15px] text-[#838995]'>
            {link.description}
          </p>
        </div>
      </div>
      {link.featured ? (
        <ArrowRight
          className='size-6 shrink-0 text-black'
          strokeWidth={2}
          aria-hidden
        />
      ) : null}
    </div>
  )

  return (
    <NavigationMenuLink asChild>
      <Link
        href={link.href}
        className='block w-full max-w-[334px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40'
      >
        {inner}
      </Link>
    </NavigationMenuLink>
  )
}

function IntegrationRow({
  title,
  description,
  href,
  iconSrc
}: {
  title: string
  description: string
  href: string
  iconSrc: string
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className='block w-full max-w-[442px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40'
      >
        <div className='flex w-full min-w-0 items-center justify-between gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F7F9FC]/80'>
          <div className='flex min-w-0 flex-1 items-start gap-2.5'>
            <Image
              src={iconSrc}
              alt=''
              width={32}
              height={32}
              className='size-8 shrink-0 object-contain'
            />
            <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
              <p className='font-inter text-[14px] font-semibold leading-[17px] text-[#1B2331]'>
                {title}
              </p>
              <p className='font-inter text-[12px] font-medium leading-[15px] text-[#838995]'>
                {description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </NavigationMenuLink>
  )
}

export function WhySharkdomMenu() {
  const { sharkdomFor, integrations, seeAllIntegrations, compareVs, promo } =
    whySharkdomMegaMenu

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className='rounded-3xl bg-transparent px-3 py-2 text-sm text-black hover:bg-[#f7f9fc] hover:text-[#6863FB] data-[state=open]:bg-[#f7f9fc]'>
        Why Prefer Sharkdom
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div
          className={cn(
            'flex max-h-[min(90vh,480px)] w-full min-w-0 max-w-none flex-col overflow-y-auto rounded-[14px] border border-[#E7ECF6] bg-white shadow-[0px_4px_4px_#8B8B8B26]',
            'md:max-h-none md:min-h-0 md:flex-row md:items-stretch md:overflow-visible'
          )}
        >
          <div
            className={cn(
              'flex w-full flex-1 flex-col gap-8 px-6 py-6',
              'md:flex-row md:items-stretch md:gap-5 md:px-[39px] md:py-[37px]'
            )}
          >
            {/* Sharkdom for */}
            <div className='flex w-full min-w-0 max-w-[334px] shrink-0 flex-col gap-3'>
              <p className='font-inter text-[12px] font-medium uppercase leading-5 text-[#505E79]'>
                Sharkdom for
              </p>
              <nav className='flex flex-col gap-3' aria-label='Sharkdom for'>
                {sharkdomFor.map((link) => (
                  <SharkdomForRow key={link.id} link={link} />
                ))}
              </nav>
            </div>

            <div
              className='hidden w-px shrink-0 self-stretch bg-[#CBDBEB] md:block'
              aria-hidden
            />

            {/* Integrations */}
            <div className='flex w-full min-w-0 max-w-[442px] shrink-0 flex-col gap-3'>
              <p className='font-inter text-[12px] font-medium uppercase leading-5 text-[#505E79]'>
                Integrations
              </p>
              <nav className='flex flex-col gap-3' aria-label='Integrations'>
                {integrations.map((item) => (
                  <IntegrationRow
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    href={item.href}
                    iconSrc={item.iconSrc}
                  />
                ))}
                <NavigationMenuLink asChild>
                  <Link
                    href={seeAllIntegrations.href}
                    className='block w-full max-w-[442px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40'
                  >
                    <div className='flex w-full min-w-0 items-center justify-between gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F7F9FC]/80'>
                      <div className='flex min-w-0 flex-1 items-start gap-2.5'>
                        <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#E7E7FF]'>
                          <Settings
                            className='size-5 text-[#6863FB]'
                            strokeWidth={1.67}
                            aria-hidden
                          />
                        </div>
                        <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                          <p className='font-inter text-[14px] font-semibold leading-[17px] text-[#1B2331]'>
                            {seeAllIntegrations.title}
                          </p>
                          <p className='font-inter text-[12px] font-medium leading-[15px] text-[#838995]'>
                            {seeAllIntegrations.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </nav>
            </div>

            <div
              className='hidden w-px shrink-0 self-stretch bg-[#CBDBEB] md:block'
              aria-hidden
            />

            {/* Compare vs + CTA */}
            <div className='flex min-w-0 flex-1 flex-col gap-5 md:max-w-[506px]'>
              <div className='flex flex-col gap-3'>
                <p className='font-inter text-[12px] font-medium uppercase leading-5 text-[#505E79]'>
                  Compare vs
                </p>
                <div className='grid max-w-[326px] grid-cols-2 gap-x-8 gap-y-3'>
                  {compareVs.map((item) => (
                    <NavigationMenuLink key={item.href} asChild>
                      <Link
                        href={item.href}
                        className='font-inter text-[14px] font-semibold leading-[17px] text-[#5B6F91] underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#6863FB]/40'
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </div>

              <div className='flex w-full flex-col gap-[34px] rounded-md bg-gradient-to-r from-[#E5EDFF] to-[#F3E3FF] px-5 py-[23px]'>
                <div className='flex flex-col gap-2'>
                  <p className='font-inter text-[12px] font-medium uppercase leading-5 text-[#2A3241]'>
                    {promo.eyebrow}
                  </p>
                  <h3 className='font-inter text-[22px] font-semibold leading-[27px] text-[#1B2331]'>
                    {promo.title}
                  </h3>
                  <p className='font-inter text-[14px] font-normal leading-5 text-[#45587D]'>
                    {promo.description}
                  </p>
                </div>
                <NavigationMenuLink asChild>
                  <Link
                    href={promo.ctaHref}
                    className='inline-flex h-9 w-fit items-center justify-center rounded-[10px] border border-[#9CA3AF] bg-white px-[18px] font-inter text-[14px] font-bold leading-5 text-[#2A3241] transition hover:bg-[#FAFBFC]'
                  >
                    {promo.ctaLabel}
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
