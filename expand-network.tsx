/* eslint-disable react/no-unescaped-entities */
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

export default function ExpandNetwork() {
  const router = useRouter()

  return (
    <div className='relative flex w-full flex-col items-center justify-center overflow-y-hidden bg-gradient-to-b from-[#0F172A] via-[#121A2F] to-[#000000]'>
      <Image
        className='absolute bottom-56 left-8 z-40 hidden 2xl:block'
        width={600}
        height={200}
        src={'/assets/expend-network-1.png'}
        alt={'cover-bg'}
      />
      <Image
        className='absolute bottom-0 right-12 z-30 hidden md:block'
        width={200}
        height={70}
        src={'/assets/expend-network-2.png'}
        alt={'cover-bg'}
      />
      <Image
        className='absolute bottom-56 right-36 z-30 hidden md:block'
        width={60}
        height={60}
        src={'/assets/expend-network-3.png'}
        alt={'cover-bg'}
      />
      <Image
        className='absolute bottom-96 left-16 z-30 hidden lg:block'
        width={60}
        height={60}
        src={'/assets/expend-network-4.png'}
        alt={'cover-bg'}
      />
      <Image
        className='absolute bottom-24 left-2/4 z-30 hidden md:block'
        width={60}
        height={60}
        src={'/assets/expend-network-4.png'}
        alt={'cover-bg'}
      />
      <Image
        className='absolute -bottom-32 left-12 z-30 hidden 2xl:block'
        width={500}
        height={500}
        src={'/assets/earth-globe.png'}
        alt={'cover-bg'}
      />
      <Image
        className='absolute -top-12 left-0 z-30 hidden md:block'
        style={{ transform: 'rotate(210deg)' }}
        width={150}
        height={150}
        src={'/assets/curve.png'}
        alt={'cover-bg'}
      />
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut'
          }}
          className='flex w-fit flex-col items-center bg-clip-text py-4 text-start text-4xl font-medium tracking-tight text-transparent md:items-start md:text-7xl'
        >
          <h1 className='text-center text-5xl font-light text-white md:text-start'>
            Introducing
          </h1>
          <p className='mt-3 text-center text-5xl font-semibold text-white md:text-start'>
            Cross Border Partnerships
          </p>
          <Link
            href='/discover'
            target='_blank'
            className='mt-9 rounded-xl bg-white px-8 py-4 text-2xl font-semibold text-black transition duration-300 ease-in-out hover:bg-cyan-400 hover:text-white md:text-3xl'
          >
            Visit Marketplace
          </Link>
        </motion.h1>
      </LampContainer>
    </div>
  )
}

export const LampContainer = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'relative flex h-[700px] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-gradient-to-b from-[#0F172A] via-[#121A2F] to-[#000000]' +
          ' z-0',
        className
      )}
    >
      <div className='relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center '>
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut'
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`
          }}
          className='bg-gradient-conic absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]'
        >
          <div className='absolute  bottom-0 left-0 z-20 h-40 w-[100%] bg-[#0F172A] [mask-image:linear-gradient(to_top,white,transparent)]' />
          <div className='absolute  bottom-0 left-0 z-20 h-[100%]  w-40 bg-[#0F172A] [mask-image:linear-gradient(to_right,white,transparent)]' />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut'
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`
          }}
          className='bg-gradient-conic absolute inset-auto left-1/2 h-56 w-[30rem] from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]'
        >
          <div className='absolute  bottom-0 right-0 z-20 h-[100%]  w-40 bg-[#0F172A] [mask-image:linear-gradient(to_left,white,transparent)]' />
          <div className='absolute  bottom-0 right-0 z-20 h-40 w-[100%] bg-[#0F172A] [mask-image:linear-gradient(to_top,white,transparent)]' />
        </motion.div>
        <div className='absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-[#0F172A] blur-2xl' />
        <div className='absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md' />
        <div className='absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl' />
        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut'
          }}
          className='absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl'
        />
        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut'
          }}
          className='absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400 '
        />

        <div className='absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-[#0F172A] ' />
      </div>

      <div className='relative z-50 flex -translate-y-80 flex-col items-center px-5'>
        {children}
      </div>
    </div>
  )
}
