'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { BookDemoForm } from '@/components/marketing/BookDemoForm'

export const EventInsiderForm = () => {
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [mounted, setMounted] = useState(false)
  const hasOpened = useRef(false)

  // Only open on client side after hydration
  useEffect(() => {
    setMounted(true)

    const openDialog = () => {
      if (!hasOpened.current) {
        hasOpened.current = true
        setOpen(true)
      }
    }

    // 1. Show after 20 seconds
    const timer = setTimeout(() => {
      openDialog()
    }, 20000)

    // 2. Show after 30% scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const scrollableHeight = documentHeight - windowHeight

      if (scrollableHeight <= 0) return

      const percent = scrollY / scrollableHeight

      if (percent >= 0.3) {
        openDialog()
        window.removeEventListener('scroll', handleScroll)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      clearTimeout(timer)
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Don't render dialog during SSR
  if (!mounted) {
    return null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) setTimeout(() => setShowForm(false), 300)
      }}
    >
      <DialogContent
        hideCloseBtn={showForm}
        className={
          showForm
            ? 'w-fit !border-none !bg-transparent !p-0 !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none sm:!rounded-none sm:!px-0 sm:!py-0'
            : 'max-w-4xl overflow-hidden p-0 sm:rounded-[24px]'
        }
      >
        {showForm ? (
          <BookDemoForm
            demoType='/partner-mapping-resource'
            onSuccess={() => {
              const link = document.createElement('a')
              link.href =
                "https://storage.googleapis.com/sharkdom_resources/hero_section/hidden%20KPI's.pdf"
              link.download = 'hidden-kpis.pdf'
              link.target = '_blank'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              setTimeout(() => setOpen(false), 500)
            }}
          />
        ) : (
          <div className='flex flex-col md:flex-row'>
            {/* Left - Text Content */}
            <div className='flex flex-[3] flex-col justify-center bg-white p-8 lg:p-12'>
              <h3 className='mb-8 text-3xl font-semibold leading-[1.1] text-[#1B1D21] sm:text-4xl lg:text-5xl'>
                KPI’s to measure{' '}
                <span className='text-[#3C3CD4]'>Partnership Outcome</span>{' '}
                ahead of partnering
              </h3>
              <button
                type='button'
                onClick={() => setShowForm(true)}
                className='inline-flex h-12 w-fit items-center gap-2 rounded-full bg-indigo-500 px-6 text-white transition-all hover:bg-indigo-600'
              >
                Download the Playbook
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Right - Image */}
            <div className='hidden flex-[2] overflow-hidden bg-gray-50 md:block'>
              <Image
                src='/assets/partner-mapping/free_resource_new.svg'
                alt='Why Most Partner Programs Go Unnoticed'
                width={600}
                height={400}
                className='h-full w-full object-cover'
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
