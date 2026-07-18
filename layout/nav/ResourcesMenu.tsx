'use client'

import React from 'react'
import Link from 'next/link'
import {
  BookOpenCheck,
  CalendarFold,
  CircleUser,
  ExternalLink,
  Factory,
  Newspaper,
  Star
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'

import {
  resourcesMegaMenu,
  type ResourcesEventLucideKey,
  type ResourcesLearnLucideKey
} from './nav-data'

const LEARN_ICONS: Record<
  ResourcesLearnLucideKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  newspaper: Newspaper,
  star: Star,
  'circle-user': CircleUser,
  'book-open-check': BookOpenCheck
}

const EVENT_ICONS: Record<
  ResourcesEventLucideKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  'calendar-fold': CalendarFold,
  factory: Factory
}

function isExternal(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

export function ResourcesMenu() {
  const { playbooks, learn, events, promo } = resourcesMegaMenu

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className='rounded-3xl bg-transparent px-3 py-2 text-sm text-black hover:bg-[#f7f9fc] hover:text-[#6863FB] data-[state=open]:bg-[#f7f9fc]'>
        Resources
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div
          className={cn(
            'flex max-h-[min(90vh,480px)] w-full min-w-0 max-w-none flex-col overflow-y-auto rounded-[14px] border border-[#E7ECF6] bg-white shadow-[0px_4px_4px_#8B8B8B26]',
            'md:max-h-[min(90vh,440px)] md:min-h-[320px] md:flex-row md:items-stretch md:overflow-visible',
            'lg:max-h-none lg:min-h-[396px]'
          )}
        >
          <div className='flex flex-1 flex-col gap-8 p-6 md:flex-row md:items-stretch md:gap-5 md:p-[37px_39px]'>
            {/* More proven playbooks */}
            <div className='flex w-full min-w-0 max-w-[314px] flex-col gap-3 md:flex-1'>
              <p className='font-inter text-[12px] font-medium uppercase leading-5 text-[#505E79]'>
                {playbooks.heading}
              </p>
              <nav className='flex flex-col' aria-label={playbooks.heading}>
                {playbooks.items.map((item) => (
                  <NavigationMenuLink key={item.id} asChild>
                    <Link
                      href={item.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex w-full max-w-[314px] items-center justify-between gap-3 rounded-md py-2.5 outline-none transition-colors hover:bg-[#F7F9FC]/80 focus-visible:ring-2 focus-visible:ring-[#6863FB]/40'
                    >
                      <div className='flex min-w-0 flex-1 items-start gap-2.5'>
                        <ExternalLink
                          className='mt-0.5 size-[18px] shrink-0 text-[#9CBAD8]'
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                          <p className='font-inter text-[14px] font-semibold leading-[17px] text-[#1B2331]'>
                            {item.title}
                          </p>
                          <p className='font-inter text-[12px] font-medium leading-[15px] text-[#838995]'>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </nav>
            </div>

            <div
              className='hidden w-px shrink-0 self-stretch bg-[#CBDBEB] md:block'
              aria-hidden
            />

            {/* Learn */}
            <div className='flex w-full min-w-0 max-w-[314px] flex-col gap-3 md:flex-1'>
              <p className='font-inter text-[12px] font-medium uppercase leading-5 text-[#505E79]'>
                {learn.heading}
              </p>
              <nav className='flex flex-col gap-3' aria-label={learn.heading}>
                {learn.items.map((item) => {
                  const Icon = LEARN_ICONS[item.icon]
                  return (
                    <NavigationMenuLink key={item.id} asChild>
                      <Link
                        href={item.href}
                        {...(isExternal(item.href)
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className='flex w-full max-w-[314px] items-center gap-2.5 rounded-xl p-2.5 outline-none transition-colors hover:bg-[#F7F9FC]/80 focus-visible:ring-2 focus-visible:ring-[#6863FB]/40'
                      >
                        <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#E6EEFF]'>
                          <Icon
                            className='size-4 text-[#2563EB]'
                            strokeWidth={1.33}
                          />
                        </div>
                        <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                          <p className='font-inter text-[14px] font-semibold leading-[17px] text-[#1B2331]'>
                            {item.title}
                          </p>
                          <p className='font-inter text-[12px] font-medium leading-[15px] text-[#838995]'>
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  )
                })}
              </nav>
            </div>

            <div
              className='hidden w-px shrink-0 self-stretch bg-[#CBDBEB] md:block'
              aria-hidden
            />

            {/* Events */}
            <div className='flex w-full min-w-0 max-w-[314px] flex-col gap-3 md:flex-1'>
              <p className='font-inter text-[12px] font-medium uppercase leading-5 text-[#505E79]'>
                {events.heading}
              </p>
              <nav className='flex flex-col gap-3' aria-label={events.heading}>
                {events.items.map((item) => {
                  const Icon = EVENT_ICONS[item.icon]
                  return (
                    <NavigationMenuLink key={item.id} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex w-full max-w-[314px] items-center gap-2.5 rounded-xl p-2.5 outline-none transition-colors hover:bg-[#F7F9FC]/80 focus-visible:ring-2 focus-visible:ring-[#6863FB]/40',
                          item.tall && 'min-h-[72px] items-start py-2.5'
                        )}
                      >
                        <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#E6EEFF]'>
                          <Icon
                            className='size-4 text-[#2563EB]'
                            strokeWidth={1.33}
                          />
                        </div>
                        <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                          <p className='font-inter text-[14px] font-semibold leading-[17px] text-[#1B2331]'>
                            {item.title}
                          </p>
                          <p className='font-inter text-[12px] font-medium leading-[15px] text-[#838995]'>
                            {item.meta}
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  )
                })}
                <NavigationMenuLink asChild>
                  <Link
                    href={events.libraryLink.href}
                    className='flex w-full max-w-[314px] flex-col gap-0.5 rounded-xl px-2.5 py-2.5 outline-none transition-colors hover:bg-[#F7F9FC]/80 focus-visible:ring-2 focus-visible:ring-[#6863FB]/40'
                  >
                    <span className='font-inter text-[14px] font-semibold leading-[17px] text-[#2563EB]'>
                      {events.libraryLink.title}
                    </span>
                    <span className='font-inter text-[12px] font-medium leading-[15px] text-[#838995]'>
                      {events.libraryLink.description}
                    </span>
                  </Link>
                </NavigationMenuLink>
              </nav>
            </div>

            <div
              className='hidden w-px shrink-0 self-stretch bg-[#CBDBEB] md:block'
              aria-hidden
            />

            {/* EVENTO promo */}
            <div className='flex w-full max-w-[287px] shrink-0 flex-col justify-between gap-8 rounded-xl bg-gradient-to-r from-[#E5EDFF] to-[#F3E3FF] px-5 py-6 md:justify-between md:px-5 md:py-[23px]'>
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
                  className='mx-auto inline-flex h-9 w-[200px] items-center justify-center rounded-[10px] border border-[#97B5E9] bg-white px-[18px] font-inter text-[14px] font-semibold leading-5 text-[#293E60] transition hover:bg-white/90'
                >
                  {promo.ctaLabel}
                </Link>
              </NavigationMenuLink>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
