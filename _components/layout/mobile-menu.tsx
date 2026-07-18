'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Bell, CircleUserRound, Home, LayoutDashboard } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const menuLinks = [
  {
    href: '/explore',
    icon: <Home size={16} className='shrink-0' />,
    title: 'Home'
  },
  {
    href: '/dashboard',
    icon: <LayoutDashboard size={16} className='shrink-0' />,
    title: 'Dashboard'
  },
  {
    href: '/settings',
    icon: <CircleUserRound size={16} className='shrink-0' />,
    title: 'Profile'
  }
]

export const MobileMenu = () => {
  const [hidden, setHidden] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0
    if (latest > previous && latest > 150 && scrollYProgress.get() < 0.9)
      // scrollYProgress.get() is to prevent the menu from hiding when the user is at the bottom of the page
      setHidden(true)
    else setHidden(false)
  })
  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '100%' }
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className='sticky bottom-0 flex justify-around border-t bg-card p-2 md:hidden'
    >
      {menuLinks.map((link) => (
        <MenuLink key={link.href} {...link} />
      ))}

      {/* <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant='ghost'
            className={cn(
              'flex flex-col self-center p-1 text-muted-foreground'
            )}
          >
            <Ellipsis size={16} className='shrink-0' />
            <span>More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='h-screen w-screen pt-36'>
          <span className='my-3 flex w-full flex-col space-y-3 self-center rounded-lg bg-[#272B30] p-3 text-white'>
            <h2 className='text-balance text-sm'>
              Get 5x more growth with Premium.
            </h2>
            <ul className='flex gap-4 text-xs text-[#FFFFFFCC]'>
              <li className='flex gap-1 text-[#DCDCDC]'>
                <CircleCheck size={15} />
                14-day trial
              </li>
              <li className='flex gap-1 text-[#DCDCDC]'>
                <CircleCheck size={15} />
                Cancel any-time
              </li>
            </ul>
            <Link
              href='/upgrade'
              className='rounded-lg bg-[#2463EB] p-2 text-center text-sm font-medium text-white'
            >
              <DropdownMenuItem className='flex justify-center p-0'>
                Start free trial
              </DropdownMenuItem>
            </Link>
          </span>
          <div className='flex flex-col gap-4 p-2'>
            <Link href='/playground' className=''>
              <DropdownMenuItem className='gap-3 p-2 text-base font-semibold text-[#101828]'>
                <Pickaxe />
                Playground
              </DropdownMenuItem>
            </Link>

            <Link href='' className=''>
              <DropdownMenuItem className='gap-3 text-base font-semibold text-[#101828]'>
                <FilePen />
                Signer
              </DropdownMenuItem>
            </Link>

            <Link href='/resources' className=''>
              <DropdownMenuItem className='gap-3 text-base font-semibold text-[#101828]'>
                <GraduationCap />
                Resources
              </DropdownMenuItem>
            </Link>

            <Link href='/offers' className=''>
              <DropdownMenuItem className='gap-3 text-base font-semibold text-[#101828]'>
                <BadgePercent />
                Deals
              </DropdownMenuItem>
            </Link>

            <Link href='/partner-programs' className=''>
              <DropdownMenuItem className='gap-3 text-base font-semibold text-[#101828]'>
                <LineChart />
                Partner Programs
              </DropdownMenuItem>
            </Link>

            <Link href='/integrations' className=''>
              <DropdownMenuItem className='gap-3 text-base font-semibold text-[#101828]'>
                <Unplug />
                Integrations
              </DropdownMenuItem>
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </motion.nav>
  )
}

type MenuLinkProps = {
  href: string
  icon: React.ReactNode
  title: string
}

const MenuLink = ({ href, icon, title }: MenuLinkProps) => {
  const pathname = usePathname()
  return (
    <Button
      asChild
      variant='ghost'
      className={cn('w-fit rounded-xl p-1 text-muted-foreground', {
        'rounded-xl bg-accent text-accent-foreground': pathname === href
      })}
    >
      <Link
        href={href}
        className='flex flex-col items-center justify-center py-6 text-[10px]'
      >
        {icon}
        <span>{title}</span>
      </Link>
    </Button>
  )
}
