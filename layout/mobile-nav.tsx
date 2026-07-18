'use client'

import React, { Fragment, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BookOpenCheck,
  Box,
  CalendarFold,
  ChevronDown,
  CircleUser,
  ExternalLink,
  Factory,
  Menu,
  Newspaper,
  Settings,
  Sparkles,
  Star,
  Users,
  Workflow
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger
} from '@/components/ui/sheet'
import { NewFullLogo } from '@/components/icons/logo'

import {
  isExternalNavHref,
  marketingMobileNavSections,
  type MarketingMobileNavSection,
  type MegaMenuRowVisual
} from './nav/marketing-mobile-nav'
import {
  type PlatformMegaIcon,
  type PlatformMegaLucideKey,
  type ResourcesEventLucideKey,
  type ResourcesLearnLucideKey,
  type WhySharkdomForLucideKey
} from './nav/nav-data'

const PLATFORM_LUCIDE: Record<
  PlatformMegaLucideKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  factory: Factory,
  sparkles: Sparkles,
  workflow: Workflow,
  settings: Settings
}

const WHY_FOR_LUCIDE: Record<
  WhySharkdomForLucideKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  box: Box,
  'badge-dollar': BadgeDollarSign,
  'bar-chart-3': BarChart3,
  users: Users
}

const RESOURCES_LEARN_LUCIDE: Record<
  ResourcesLearnLucideKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  newspaper: Newspaper,
  star: Star,
  'circle-user': CircleUser,
  'book-open-check': BookOpenCheck
}

const RESOURCES_EVENT_LUCIDE: Record<
  ResourcesEventLucideKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  'calendar-fold': CalendarFold,
  factory: Factory
}

function PlatformDrawerIcon({
  icon,
  wrapClass,
  title
}: {
  icon: PlatformMegaIcon
  wrapClass: string
  title: string
}) {
  return (
    <div
      className={cn(
        'flex size-[30px] shrink-0 items-center justify-center',
        wrapClass
      )}
    >
      {icon.kind === 'lucide' ? (
        (() => {
          const I = PLATFORM_LUCIDE[icon.name]
          return <I className={cn('size-4', icon.className)} strokeWidth={2} />
        })()
      ) : (
        <Image
          src={icon.src}
          alt={icon.alt || `${title} icon`}
          width={16}
          height={16}
          className='size-4 object-contain'
        />
      )}
    </div>
  )
}

function MobileNavMegaIcon({
  visual,
  title
}: {
  visual: MegaMenuRowVisual
  title: string
}) {
  switch (visual.variant) {
    case 'platform':
      return (
        <PlatformDrawerIcon
          icon={visual.icon}
          wrapClass={visual.iconWrapClassName}
          title={title}
        />
      )
    case 'why-for':
      if (visual.featured && visual.featuredIconSrc) {
        return (
          <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-white'>
            <Image
              src={visual.featuredIconSrc}
              alt=''
              width={16}
              height={16}
              className='size-4 brightness-0'
            />
          </div>
        )
      }
      if (visual.lucide) {
        const I = WHY_FOR_LUCIDE[visual.lucide]
        return (
          <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#E6EEFF]'>
            <I className='size-4 text-[#2563EB]' strokeWidth={1.33} />
          </div>
        )
      }
      return null
    case 'integration':
      return (
        <div className='flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded bg-[#E6EEFF]'>
          <Image
            src={visual.iconSrc}
            alt=''
            width={24}
            height={24}
            className='size-6 object-contain'
          />
        </div>
      )
    case 'resource-learn': {
      const I = RESOURCES_LEARN_LUCIDE[visual.lucide]
      return (
        <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#E6EEFF]'>
          <I className='size-4 text-[#2563EB]' strokeWidth={1.33} />
        </div>
      )
    }
    case 'resource-event': {
      const I = RESOURCES_EVENT_LUCIDE[visual.lucide]
      return (
        <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#E6EEFF]'>
          <I className='size-4 text-[#2563EB]' strokeWidth={1.33} />
        </div>
      )
    }
    case 'playbook':
      return (
        <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#F7F9FC]'>
          <ExternalLink
            className='size-[18px] text-[#9CBAD8]'
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      )
    case 'see-all-integrations':
      return (
        <div className='flex size-[30px] shrink-0 items-center justify-center rounded bg-[#E6EEFF]'>
          <Settings className='size-4 text-[#2563EB]' strokeWidth={1.33} />
        </div>
      )
    default:
      return null
  }
}

function MobileDrawerSectionAccordion({
  section,
  openSection,
  toggleSection
}: {
  section: MarketingMobileNavSection
  openSection: string | null
  toggleSection: (key: string) => void
}) {
  const isOpen = openSection === section.key
  return (
    <div
      className={cn(
        'mb-3 overflow-hidden rounded-xl border transition-colors',
        isOpen
          ? 'border-[#C5D0E0] bg-white shadow-[0_4px_14px_-4px_rgba(15,23,42,0.12)]'
          : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
      )}
    >
      <button
        type='button'
        onClick={() => toggleSection(section.key)}
        aria-expanded={isOpen}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left',
          'text-[17px] font-bold leading-snug tracking-tight text-[#0F172A]',
          isOpen && 'border-b border-[#E8EDF3] bg-[#F8FAFC]'
        )}
      >
        <span className='min-w-0'>{section.label}</span>
        <ChevronDown
          size={20}
          className={cn(
            'shrink-0 text-[#64748B] transition-transform duration-300 ease-out',
            isOpen && 'rotate-180'
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className='overflow-hidden'>
          <div className='flex flex-col gap-4 px-3 pb-4 pt-3'>
            {section.groups.map((group) => (
              <div key={group.id}>
                {group.heading.trim() ? (
                  <p className='mb-2 border-l-2 border-[#6863FB]/35 pl-2.5 font-inter text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-[#64748B]'>
                    {group.heading}
                  </p>
                ) : null}
                <div className='flex flex-col gap-1 rounded-lg bg-[#F1F5F9]/45 p-1.5'>
                  {group.links.map((item) => {
                    const external = isExternalNavHref(item.href)
                    return (
                      <SheetClose asChild key={item.id}>
                        <Link
                          href={item.href}
                          {...(external
                            ? {
                                target: '_blank',
                                rel: 'noopener noreferrer'
                              }
                            : {})}
                          className={cn(
                            'flex items-start gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors',
                            item.featured
                              ? 'bg-gradient-to-r from-[#E5EDFF] to-[#F3E3FF] hover:opacity-95'
                              : 'bg-white/90 hover:bg-white'
                          )}
                        >
                          {item.megaVisual ? (
                            <MobileNavMegaIcon
                              visual={item.megaVisual}
                              title={item.label}
                            />
                          ) : null}
                          <div className='min-w-0 flex-1'>
                            <span className='font-inter text-[13px] font-medium leading-snug text-[#1B2331]'>
                              {item.label}
                            </span>
                            {item.description ? (
                              <span className='mt-0.5 block font-inter text-[11px] font-normal leading-snug text-[#64748B]'>
                                {item.description}
                              </span>
                            ) : null}
                          </div>
                          {item.featured ? (
                            <ArrowRight
                              className='mt-0.5 size-5 shrink-0 text-black'
                              strokeWidth={2}
                              aria-hidden
                            />
                          ) : null}
                        </Link>
                      </SheetClose>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- COMPONENT --------------- */

export default function MobileNav() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key))
  }

  return (
    <div className='flex items-center xl:hidden'>
      <Sheet>
        <SheetTrigger className='flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground'>
          <Menu className='h-6 w-6' />
        </SheetTrigger>

        <SheetContent className='z-[999] px-4'>
          <SheetClose />

          <ScrollArea className='h-full'>
            <SheetHeader className='flex items-center justify-center py-5'>
              <NewFullLogo className='h-11 min-h-[44px] w-auto min-w-[200px] object-contain sm:h-12 sm:min-h-[48px] sm:min-w-[220px]' />
            </SheetHeader>

            <Separator />

            <nav className='flex flex-col' aria-label='Main'>
              {marketingMobileNavSections.map((section) =>
                section.key === 'resources' ? (
                  <Fragment key='pricing-then-resources'>
                    <SheetClose asChild>
                      <Link
                        href='/pricing'
                        className='mb-3 flex min-h-[48px] items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-[17px] font-bold text-[#0F172A] transition-colors hover:border-[#CBD5E1] hover:bg-[#F1F5F9]'
                      >
                        Pricing
                      </Link>
                    </SheetClose>
                    <MobileDrawerSectionAccordion
                      section={section}
                      openSection={openSection}
                      toggleSection={toggleSection}
                    />
                  </Fragment>
                ) : (
                  <MobileDrawerSectionAccordion
                    key={section.key}
                    section={section}
                    openSection={openSection}
                    toggleSection={toggleSection}
                  />
                )
              )}
            </nav>

            <Separator />

            <SheetFooter className='pb-8 pt-6'>
              <div className='flex w-full flex-col gap-2'>
                <SheetClose asChild>
                  <Link
                    href='/book-demo'
                    className={cn(
                      'relative z-10 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-[#3E5DA1] bg-[#5B76FF] px-4',
                      'font-sansGeneral text-sm font-semibold leading-none text-white',
                      'shadow-[0px_3px_0px_0px_#3E5DA1]',
                      'transition hover:translate-y-px hover:shadow-[0px_2px_0px_0px_#3E5DA1]',
                      'active:translate-y-[2px] active:shadow-none',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40 focus-visible:ring-offset-2'
                    )}
                  >
                    Book a Demo
                    <ArrowRight
                      className='size-3.5 shrink-0'
                      strokeWidth={2.25}
                      aria-hidden
                    />
                  </Link>
                </SheetClose>
                <div className='flex w-full min-w-0 gap-2'>
                  <SheetClose asChild>
                    <Link
                      href='/register'
                      className={cn(
                        'relative z-10 inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-lg border border-[#3E5DA1] bg-[#5B76FF] px-3',
                        'font-sansGeneral text-sm font-semibold leading-none text-white',
                        'shadow-[0px_3px_0px_0px_#3E5DA1]',
                        'transition hover:translate-y-px hover:shadow-[0px_2px_0px_0px_#3E5DA1]',
                        'active:translate-y-[2px] active:shadow-none',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40 focus-visible:ring-offset-2'
                      )}
                    >
                      Try for free
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href='/login'
                      className={cn(
                        'relative z-10 inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-lg border border-[#5B76FF] bg-white px-3',
                        'font-sansGeneral text-sm font-semibold leading-none text-[#5B76FF]',
                        'shadow-[0px_3px_0px_0px_#5B76FF]',
                        'transition hover:translate-y-px hover:bg-[#F8F9FF] hover:shadow-[0px_2px_0px_0px_#5B76FF]',
                        'active:translate-y-[2px] active:shadow-none',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B76FF] focus-visible:ring-offset-2'
                      )}
                    >
                      Login
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetFooter>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
