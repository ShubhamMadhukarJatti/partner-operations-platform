import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ChevronRight } from 'lucide-react'

type Props = {
  title: string
  desc: string
  ctaTitle: string
}

function Header({ title, desc, ctaTitle }: Props) {
  return (
    <section className='relative bg-white py-12 text-center md:py-20'>
      <Image src={'/assets/grid-bg.svg'} alt='grid-bg' fill />
      {/* Heading Section */}
      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h1 className='mb-4 text-5xl font-semibold text-gray-900'>{title}</h1>
        <h2 className='text-5xl font-semibold text-gray-900'>
          You are <span className='text-blue-600'>losing out</span> big time.
        </h2>
        <p className='mx-auto mt-4 max-w-3xl text-lg text-gray-500'>{desc}</p>

        {/* Buttons Section */}
        <div className='mt-8 flex flex-col items-center justify-center gap-4 md:flex-row'>
          <Link
            href={'#feature-comparison'}
            className='flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-white shadow-md transition hover:bg-blue-700'
          >
            {ctaTitle}
            <ArrowDown size={20} />
          </Link>
          <Link
            href={'/book-demo'}
            className='bg-tranparent flex items-center gap-2 px-6 py-3 font-bold text-[#2160FD]'
          >
            Talk to the team
            <ChevronRight />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Header
