import Image from 'next/image'
import Sharanagati from '@/../public/assets/sharanagatilogo.svg'
import fullLogo2 from '@/../public/icons/full-logo-2.svg'
import fullLogo from '@/../public/icons/full-logo.svg'
import whiteLogo from '@/../public/icons/logo-white.svg'
import logo from '@/../public/icons/logo.png'
import NewLogo from '@/../public/icons/new-logo.svg'
import smallLogo from '@/../public/icons/small-logo.svg'
import IconLogo from '@/../public/small-logo.svg'

import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className='logo'>
      <Image
        src={logo}
        alt='Sharkdom logo'
        unoptimized
        className={cn('h-14 w-14 object-contain', className)}
      />
    </div>
  )
}

export const FullLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src={fullLogo}
      alt='Sharkdom logo'
      unoptimized
      className={cn('h-14 w-auto object-contain', className)}
    />
  )
}
export const FullLogoWhite = ({ className }: { className?: string }) => {
  return (
    <Image
      src={whiteLogo}
      alt='Sharkdom logo'
      unoptimized
      className={cn('h-14 w-auto object-contain', className)}
    />
  )
}

export const FullLogo2 = ({ className }: { className?: string }) => {
  return (
    <Image
      src={fullLogo2}
      alt='Sharkdom logo'
      unoptimized
      className={cn('h-14 w-auto object-contain', className)}
    />
  )
}

export const SmallLogo = ({ className }: { className?: string }) => {
  return (
    <div className='logo'>
      <Image
        src={smallLogo}
        alt='Sharkdom logo'
        unoptimized
        className={cn('h-14 w-auto object-contain', className)}
      />
    </div>
  )
}

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src={IconLogo}
      alt='Sharkdom logo'
      unoptimized
      className={cn('h-14 w-auto object-contain', className)}
    />
  )
}

export const SharanagatiLogo = ({ className }: { className?: string }) => {
  return (
    <div className='logo'>
      <Image
        src={Sharanagati}
        alt='Sharanagati logo'
        unoptimized
        className={cn('h-6 w-auto object-contain sm:h-9', className)}
      />
    </div>
  )
}

export const NewFullLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src={NewLogo}
      alt='Sharkdom logo'
      unoptimized
      className={cn('h-12 w-auto object-contain', className)}
    />
  )
}
