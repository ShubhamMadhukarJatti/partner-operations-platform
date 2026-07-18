'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download } from 'lucide-react'

import { sendEBook } from '@/lib/db/e-book'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

function EBook() {
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const handleOnDownload = async () => {
    try {
      if (!input) {
        showCustomToast(
          'Error',
          'Please enter your email to get your e-book!',
          'error',
          5000
        )
        return
      }
      setIsDownloading(true)
      const res = await sendEBook(input)
      if (res?.status === 200) {
        showCustomToast(
          'Success',
          'E-book has been sent on your email.',
          'success',
          5000
        )
      } else
        showCustomToast(
          'Error',
          'Error while sending E-book on your email!',
          'error',
          5000
        )
      setIsDownloading(false)
      setInput('')
    } catch (error) {
      console.log('download error -- ', error)
      showCustomToast('Error', 'Error in sending you eBook', 'error', 5000)
      setIsDownloading(false)
    }
  }

  return (
    <>
      <div className='mx-auto w-full max-w-7xl px-4 py-16 md:px-6'>
        <div className='relative overflow-hidden rounded-2xl bg-primary-dark-blue p-6 md:p-10'>
          <div className='grid gap-8 lg:grid-cols-2'>
            {/* Content Section */}
            <div className='relative z-10 flex flex-col justify-between'>
              <div className='space-y-6'>
                <h3 className='text-balance  text-2xl font-semibold tracking-tight text-white md:text-3xl lg:text-4xl'>
                  Using AI To Establish Successful B2B Growth Partnerships
                </h3>

                <blockquote className=' border-l-2 border-primary-light-blue pl-4'>
                  <p className='text-lg italic text-neutral-200'>
                    {` "Truely astonishing about this resource is that it made us
                    clear with terminologies and which kind of partners clears
                    our use case for Ecosystem led Growth."`}
                  </p>
                </blockquote>

                <div className='flex items-center gap-4'>
                  <Image
                    src='/icons/ravi-kishore-logo.svg'
                    alt='Ravi Kishore profile'
                    width={60}
                    height={60}
                    className='rounded-full border-2 border-white'
                  />
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium text-white'>Ravi Kishore</p>
                      <p className='text-sm text-neutral-200'>|</p>
                      <p className='text-sm text-neutral-200'>
                        CTO & Co-founder
                      </p>
                    </div>
                    <Image
                      src='/icons/kaksha-setu-ai.svg'
                      alt='Kaksha Setu AI'
                      width={140}
                      height={20}
                      className='mt-1 brightness-0 invert filter'
                    />
                  </div>
                </div>
              </div>

              <div className='mt-6 w-full max-w-md'>
                <div className='relative mt-1 rounded-md shadow-sm'>
                  <Input
                    type='email'
                    id='email'
                    className='block w-full rounded-md border-text-20 pr-24 focus:border-blue-500 focus:ring-blue-500 sm:pr-32'
                    placeholder='Enter your email..'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className='absolute inset-y-0 right-0  flex items-center'>
                    <Button
                      onClick={handleOnDownload}
                      disabled={isDownloading || !input}
                      className='inline-flex items-center rounded-md border border-transparent bg-primary-light-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    >
                      {isDownloading ? (
                        <>
                          <span className='mr-2'>Downloading...</span>
                          <Download className='h-4 w-4 animate-bounce' />
                        </>
                      ) : (
                        <>
                          <span className='mr-2'>Download</span>
                          <Download className='h-4 w-4' />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className='relative hidden lg:block'>
              {/* <Image
                src='/assets/e-book-guide.png'
                width={500}
                height={600}
                alt='E-book guide preview'
                className='absolute right-0 top-1/2 -translate-y-1/2 transform rounded-xl object-contain'
              /> */}

              <Image
                src={'/assets/e-book-guide.png'}
                width={320}
                height={400}
                alt='linear demo image'
                className='absolute mt-6 rounded-2xl   object-contain md:right-[-5%] md:top-1/2 md:mt-0 lg:right-[-10%] lg:top-12'
              />
            </div>

            {/* Mobile Image */}
            <div className='relative mt-8 lg:hidden'>
              <Image
                src='/assets/e-book-guide.png'
                width={300}
                height={400}
                alt='E-book guide preview'
                className='mx-auto rounded-xl'
              />
            </div>
          </div>

          {/* Background Gradient */}
          <div className='to-primary-dark-blue/50 absolute inset-0 bg-gradient-to-r from-transparent' />
        </div>
      </div>
    </>
  )
}

export default EBook
