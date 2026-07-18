'use client'

import Link from 'next/link'

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'

import { customerStoriesMenuLinks } from './nav-data'

export function CustomerStoriesMenu() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className='rounded-3xl bg-transparent px-3 py-2 text-sm text-black hover:bg-[#f7f9fc] hover:text-[#6863FB] data-[state=open]:bg-[#f7f9fc]'>
        Customer Stories
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className='flex w-full justify-start'>
          <div className='w-[250px] rounded-[12px] border border-[#E7ECF6] bg-white p-6 shadow-[0px_4px_4px_#8B8B8B26]'>
            <div className='flex flex-col gap-3'>
              {customerStoriesMenuLinks.map((story) => (
                <NavigationMenuLink asChild key={story.id}>
                  <Link
                    href={story.href}
                    className='rounded-[8px] px-4 py-3 transition hover:bg-[#f7f9fc]'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <span className='font-inter text-[14px] font-medium leading-[20px] text-black'>
                      {story.title}
                    </span>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
