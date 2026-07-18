'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Factory, Settings, Sparkles, Workflow } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'

import {
  platformMegaMenu,
  type PlatformMegaIcon,
  type PlatformMegaLink,
  type PlatformMegaLucideKey
} from './nav-data'

const LUCIDE_MAP: Record<
  PlatformMegaLucideKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  factory: Factory,
  sparkles: Sparkles,
  workflow: Workflow,
  settings: Settings
}

function MegaIcon({
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
          const I = LUCIDE_MAP[icon.name]
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

function MegaLinkRow({ link }: { link: PlatformMegaLink }) {
  const inner = (
    <div
      className={cn(
        'flex w-full min-w-0 items-center justify-between gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F7F9FC]/80',
        link.featured &&
          'rounded-md bg-gradient-to-r from-[#E5EDFF] to-[#F3E3FF] hover:opacity-95'
      )}
    >
      <div className='flex min-w-0 flex-1 items-start gap-2.5'>
        <MegaIcon
          icon={link.icon}
          wrapClass={link.iconWrapClassName}
          title={link.title}
        />
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
        className='block w-full max-w-[314px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40'
      >
        {inner}
      </Link>
    </NavigationMenuLink>
  )
}

export function PlatformMenu() {
  const { columns, promo } = platformMegaMenu

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className='rounded-3xl bg-transparent px-3 py-2 text-sm text-black hover:bg-[#f7f9fc] hover:text-[#6863FB] data-[state=open]:bg-[#f7f9fc]'>
        Platform
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div
          className={cn(
            'flex max-h-[min(90vh,420px)] w-full min-w-0 max-w-none flex-col overflow-y-auto rounded-[14px] border border-[#E7ECF6] bg-white shadow-[0px_4px_4px_#8B8B8B26]',
            'md:max-h-[min(90vh,380px)] md:min-h-[300px] md:flex-row md:items-stretch md:overflow-visible',
            'lg:max-h-none lg:min-h-[340px]'
          )}
        >
          <div className='flex flex-1 flex-col gap-8 p-6 md:flex-row md:items-stretch md:gap-5 md:p-[37px_39px]'>
            {columns.map((col, colIdx) => (
              <React.Fragment key={col.id}>
                {colIdx > 0 ? (
                  <div
                    className='hidden w-px shrink-0 self-stretch bg-[#CBDBEB] md:block'
                    aria-hidden
                  />
                ) : null}
                <div className='flex w-full min-w-0 max-w-[314px] flex-col gap-3 md:flex-1'>
                  <p className='font-inter text-[12px] font-medium uppercase leading-5 text-[#505E79]'>
                    {col.heading}
                  </p>
                  <nav
                    className='flex flex-col gap-3 md:gap-[14px]'
                    aria-label={col.heading}
                  >
                    {col.links.map((link) => (
                      <MegaLinkRow key={link.id} link={link} />
                    ))}
                  </nav>
                </div>
              </React.Fragment>
            ))}

            <div
              className='hidden w-px shrink-0 self-stretch bg-[#CBDBEB] md:block'
              aria-hidden
            />

            <div className='flex w-full max-w-[287px] shrink-0 flex-col justify-between gap-8 rounded-md bg-gradient-to-r from-[#E5EDFF] to-[#F3E3FF] px-5 py-6 md:px-5 md:py-[23px]'>
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
                  className='inline-flex h-9 w-fit items-center justify-center rounded-[10px] border border-[#9CA3AF] bg-white px-[18px] font-inter text-[14px] font-bold leading-5 text-[#1E1E1E] transition hover:bg-[#FAFBFC]'
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
