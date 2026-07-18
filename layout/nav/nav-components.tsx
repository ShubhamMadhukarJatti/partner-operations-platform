import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'

import { PlatformMenuItem } from './nav-data'

// Platform menu card component
export const PlatformMenuCard = ({ item }: { item: PlatformMenuItem }) => (
  <Link href={item.href} className='block'>
    <div className='flex h-full flex-col gap-2 rounded-lg border border-[#C8CFDC] p-4 transition-shadow hover:shadow-sm'>
      <div className='mb-2 flex items-center gap-2'>
        <Image src={item.icon} alt={item.alt} width={24} height={24} />
        <h6 style={{ fontSize: '14px' }} className='text-sm text-black'>
          {item.title}
        </h6>
      </div>
      <p className='text-xs text-gray-600'>{item.description}</p>
    </div>
  </Link>
)

// List item component for navigation links
export const NavListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: string; hoverColor?: string }
>(
  (
    {
      className,
      title,
      icon,
      hoverColor = 'hover:bg-[#FFF1CD]',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition',
              hoverColor,
              className
            )}
            {...props}
          >
            {icon && (
              <Image src={icon} alt={`${title}-icon`} width={20} height={20} />
            )}
            <span className='font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
              {title}
            </span>
            {children}
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
NavListItem.displayName = 'NavListItem'

// Playbook link item
export const PlaybookLinkItem = ({
  title,
  description,
  href
}: {
  title: string
  description: string
  href: string
}) => (
  <Link href={href}>
    <div className='my-2'>
      <p className='mb-1 px-4 align-middle text-[14px] font-semibold leading-[24px] text-[#242424]'>
        {title}
      </p>
      <span className='inline-block px-4 align-middle text-[12px] leading-[24px] text-[#746F9A]'>
        {description}
        <Image
          src={'/assets/arrow-right-up.svg'}
          alt='arrow-right-up'
          className='inline-block'
          width={15}
          height={15}
        />
      </span>
    </div>
  </Link>
)
