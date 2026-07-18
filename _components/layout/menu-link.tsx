import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

type MenuItemType = {
  href: string
  label: string
}

type MenuLinkProps = {
  href?: string
  expandedMenu: boolean
  icon: React.ReactNode
  title: string
  number?: number
  dropdownItems?: MenuItemType[]
}

export const MenuLink: React.FC<MenuLinkProps> = ({
  href,
  expandedMenu,
  icon,
  title,
  number,
  dropdownItems
}) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const isActive = href && pathname?.startsWith(href)
  const isDropdown = !!dropdownItems && dropdownItems.length > 0

  const toggleDropdown = () => setIsOpen(!isOpen)

  const renderLink = (linkHref: string, linkContent: React.ReactNode) => (
    <Link
      href={linkHref}
      className={cn(
        'flex w-full items-center',
        expandedMenu ? 'justify-between' : 'justify-center'
      )}
      target={linkHref?.startsWith('http') ? '_blank' : undefined}
      aria-label={expandedMenu ? undefined : title}
    >
      {linkContent}
    </Link>
  )

  const linkContent = (
    <>
      <span className='flex items-center gap-3'>
        <span className='flex size-6 items-center justify-center'>{icon}</span>
        {expandedMenu && <span className='text-sm'>{title}</span>}
      </span>
      {number !== undefined && number > 0 && (
        <span className='mr-2 flex size-6 items-center justify-center rounded-md bg-[#3A3F44] text-xs font-medium text-[#FF5038]'>
          {number} left
        </span>
      )}
      {isDropdown && expandedMenu && (
        <span className='ml-2'>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      )}
    </>
  )

  return (
    <div>
      <Tooltip delayDuration={expandedMenu ? 2000 : 200}>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size={expandedMenu ? 'default' : 'icon'}
            className={cn(
              'w-full justify-start px-2 py-2 text-[#8B8B8B] hover:bg-[#1E2124] hover:text-white',
              {
                'bg-[#1E2124] text-white': isActive
              }
            )}
            onClick={isDropdown ? toggleDropdown : undefined}
          >
            {isDropdown ? linkContent : renderLink(href!, linkContent)}
          </Button>
        </TooltipTrigger>
        {!expandedMenu && (
          <TooltipContent side='right'>
            <p>{title}</p>
          </TooltipContent>
        )}
      </Tooltip>

      {isDropdown && isOpen && expandedMenu && (
        <div className='ml-8 mt-1 space-y-1'>
          {dropdownItems.map((item, index) => (
            <Button
              key={index}
              asChild
              variant='ghost'
              size='sm'
              className={cn(
                'w-full justify-start px-2 py-1 text-sm text-[#8B8B8B] hover:bg-[#1E2124] hover:text-white',
                {
                  'bg-[#1E2124] text-white': pathname === item.href
                }
              )}
            >
              {renderLink(item.href, item.label)}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
