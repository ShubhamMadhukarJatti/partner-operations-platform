'use client'

import React, { useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { showCustomToast } from '@/components/custom-toast'

export default function BlogHeroSection() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [businessEmail, setBusinessEmail] = useState<string>('')

  async function handleBookDemo(values: string) {
    try {
      if (!businessEmail)
        return showCustomToast('Error', 'Enter a valid email', 'error', 5000)
      setIsLoading(true)
      const response = await fetch(`/api/demo-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify({ businessEmail })
      })
      if (!response.ok) {
        throw new Error(`Failed to post data. Status: ${response.status}`)
      }

      setBusinessEmail('')
      showCustomToast('Success', 'Subscribed', 'success', 5000)
    } catch (error: any) {
      showCustomToast('Error', error, 'error', 5000)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <section
      className='relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#DCDFEE] pt-20'
      style={{
        backgroundImage: "url('/bg-g.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className='mx-auto w-full max-w-6xl px-4 md:px-8'>
        <div className='flex flex-col-reverse items-center gap-12 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex max-w-xl flex-col justify-center text-center lg:max-w-2xl lg:text-left'>
            <h1 className='relative z-10 mx-auto max-w-3xl bg-gradient-to-r from-[#1D4ED8] to-[#55CBFB] bg-clip-text py-2 text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-[40px]'>
              <span className='mb-0.5 block text-black'>
                Learn how as a co-founder you can use the
              </span>
              <br />
              <span className='bg-gradient-to-r from-[#1D4ED8] to-[#55CBFB] bg-clip-text text-transparent'>
                power of partnerships?
              </span>
            </h1>
            <p className='relative z-10 mx-auto my-2 mt-2 max-w-2xl text-base font-normal text-black/60 sm:text-lg md:mt-0 md:text-xl'>
              Get partnerships materials, case studies and our ongoing AI
              solution from CXPO’s in driving revenue for your startups with
              partnerships.
            </p>

            <div>
              <p className='mb-3 mt-8 text-[11px] text-[#4E5059]'>
                By submitting this form you agree to Sharkdom&apos;s
                <a
                  href={'/privacy-policy'}
                  className='ml-2 text-[#002EFD] underline'
                >
                  Privacy Policy.
                </a>
              </p>
              <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center'>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  className='h-12 w-full max-w-sm rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-12 sm:rounded-none sm:rounded-l-md'
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
                <Button
                  className='h-12 w-full rounded-md sm:h-12 sm:w-auto sm:rounded-none sm:rounded-r-md'
                  type='submit'
                  onClick={() => handleBookDemo(businessEmail)}
                  loading={isLoading}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className='mt-4 flex w-full justify-center overflow-hidden lg:mt-0 lg:w-[35%]'>
            <Image
              className='h-auto w-full max-w-xs mix-blend-normal sm:max-w-sm lg:max-w-md'
              src={'/assets/free-demo-guide-cover.svg'}
              width={400}
              height={550}
              alt={'cover-bg'}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

{
  /* <div className='relative flex h-auto flex-col justify-around  px-5 py-14 text-center sm:px-12 sm:py-20'>
<div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row'>
  <div className='flex basis-3/4 flex-col items-start gap-5 text-white'>
    <p className='text-sm font-medium uppercase'>dive-in.partner.scale</p>
    <p className='text-start text-5xl font-bold xl:text-7xl'>
      Sharkdom Resources
    </p>
    <p className='text-start text-2xl font-light leading-10 xl:text-[32px]'>
      Making ecosystems and partnerships a little less daunting through
      the latest industry insights, thought leadership, and data-backed
      resources.
    </p>
  </div>
  <div className='max-w-80 basis-1/4 rounded-lg bg-[#DADEFB] lg:w-full'>
    <div className='flex flex-col items-start gap-4 p-6'>
      <p className='text-start text-xl font-bold md:text-3xl xl:text-4xl'>
        Get free resources to get your started
      </p>
      <p className='mb-3 text-start text-sm text-[#4E5059] xl:text-base'>
        Sign up for our newsletter to enjoy premium partnerships and
        ecosystem content you can’t get anywhere else.
      </p>
    </div>
    <div className='flex flex-row items-center'>
      <Input
        className='rounded-none rounded-bl-md focus-visible:ring-0 focus-visible:ring-offset-0'
        type='text'
        placeholder='Enter your email'
      />
      <Button
        className='rounded-none rounded-br-md'
        type='submit'
        value='Subscribe'
      >
        Subscribe
      </Button>
    </div>
  </div>
</div>
<div className='mx-auto mt-24 flex w-full flex-col-reverse rounded-lg bg-white sm:max-w-4xl md:flex-row'>
  <div className='flex w-full flex-col items-start rounded-b-lg bg-[#EEF0FD] py-16 pl-8 pr-12 md:w-7/12 md:rounded-b-none md:rounded-l-lg'>
    <p className='mb-4 text-start text-xs text-[#7C808D] sm:text-sm'>
      SUBSCRIBE TO OUR UPDATES
    </p>
    <p className='mb-1 text-start text-2xl font-bold sm:text-4xl'>
      Learn how as a co-founder you can use the power of partnerships?
    </p>
    <p className='text-start text-sm text-[#4E5059] sm:text-base'>
      Get partnerships materials, case studies and our ongoing AI solution
      from CXPO’s in driving revenue for your startups with partnerships.
    </p>
    <p className='mb-3 mt-8 text-[11px] text-[#4E5059]'>
      By submitting this form you agree to Sharkdom&apos;s
      <a
        href={'/privacy-policy'}
        className='ml-2 text-[#002EFD] underline'
      >
        Privacy Policy.
      </a>
    </p>
    <div className='flex h-12 w-full flex-row items-center'>
      <Input
        className='h-full rounded-none rounded-l-md focus-visible:ring-0 focus-visible:ring-offset-0'
        type='text'
        placeholder='Enter your email'
      />
      <Button
        className='h-full rounded-none'
        type='submit'
        value='Subscribe'
      >
        Subscribe
      </Button>
    </div>
  </div>
  <div
    className='flex h-96 w-full items-center justify-center overflow-hidden rounded-t-lg bg-[#eef0fd] md:h-auto md:w-5/12 md:rounded-r-lg md:rounded-t-none'
    style={{
      background:
        "url('/assets/free-demo-guide-cover.svg') no-repeat center",
      backgroundSize: 'cover'
    }}
  />
</div>
</div> */
}
