'use client'

import { useRef } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

import {
  CustomerStoriesMenu,
  PlatformMenu,
  ResourcesMenu,
  WhySharkdomMenu
} from './nav'
import { useMegaMenuAlignToHeader } from './use-mega-menu-align-to-header'

type NewNavProps = {
  /** When set (marketing pill header), mega menu width matches this element */
  headerPillRef?: React.RefObject<HTMLElement | null>
}

function NewNav({ headerPillRef }: NewNavProps) {
  const navRootRef = useRef<React.ElementRef<typeof NavigationMenu>>(null)
  useMegaMenuAlignToHeader(headerPillRef, navRootRef)

  return (
    <NavigationMenu
      ref={navRootRef}
      className='hidden min-w-0 max-w-6xl xl:flex'
    >
      <NavigationMenuList className='gap-2'>
        {/* Platform */}
        <PlatformMenu />

        {/* Why Prefer Sharkdom */}
        <WhySharkdomMenu />

        {/* Customer Stories */}
        <CustomerStoriesMenu />

        {/* Pricing */}
        <NavigationMenuItem>
          <Link href='/pricing' legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'rounded-3xl bg-transparent px-3 py-2 text-sm text-black hover:bg-[#f7f9fc] hover:text-[#6863FB]'
              )}
            >
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Resources */}
        <ResourcesMenu />
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NewNav
