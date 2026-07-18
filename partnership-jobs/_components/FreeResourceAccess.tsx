'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import DownloadPlaybookButton from '@/components/marketing/DownloadPlaybookButton'

const FreeResourceAccess = () => {
  const pdfUrl =
    'https://storage.googleapis.com/sharkdom_resources/hero_section/Group%201511077421%20(1).pdf'
  const fileName = 'Security_Overview.pdf'

  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      {/* Section Header */}
      <div className='mb-12 flex flex-col items-center text-center'>
        <h2 className='mb-2 text-4xl font-medium text-text-black md:text-5xl'>
          Need Deeper Details?
        </h2>
        <p className='text-lg text-text-muted'>
          Make Sharkdom your only Go-To-market platform for all your partner ops
        </p>
      </div>
      <div className='flex gap-6'>
        {/* Left - Text Content */}
        <div className='flex flex-[3] flex-col justify-center rounded-[24px] border border-[var(--text-20)] p-8 shadow-[0px_1px_2px_0px_#0000000F] lg:p-12'>
          <h3
            className='text-black-dark mb-8 font-medium leading-[1.1] md:pr-6'
            style={{ fontSize: 'clamp(28px, 6vw, 60px)' }}
          >
            Why Partnership/GTM team should avoid{' '}
            <span className='text-[#3C3CD4]'>CRM’s over PRM</span> at all cost?
          </h3>
          <DownloadPlaybookButton pdfUrl={pdfUrl} fileName={fileName} />
        </div>

        {/* Right - Image */}
        <div className='hidden flex-[2] overflow-hidden rounded-[24px] shadow-[0px_1px_2px_0px_#0000000F] md:block'>
          <Image
            src='/assets/playbook_img.svg'
            alt='Why Most Partner Programs Go Unnoticed'
            width={600}
            height={400}
            className='h-full w-full object-cover'
          />
        </div>
      </div>
    </section>
  )
}

export default FreeResourceAccess
