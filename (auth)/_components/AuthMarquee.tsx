import React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Marquee } from '@/components/magicui/marquee'

const ImageArray = [
  {
    imag: '/auth/1.png'
  },
  {
    imag: '/auth/2.png'
  },
  {
    imag: '/auth/3.png'
  },
  {
    imag: '/auth/4.png'
  }
]

const AuthMarquee = () => {
  return (
    <div>
      <Marquee className='!gap-6 py-6 [--duration:20s]'>
        {ImageArray.map((item, key) => (
          <Image
            key={key}
            className='mix-blend-color-dodge'
            src={item.imag}
            alt=''
            width={64}
            height={64}
          />
        ))}
      </Marquee>
    </div>
  )
}

export default AuthMarquee
